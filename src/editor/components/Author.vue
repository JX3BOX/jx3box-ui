<template>
    <div class="w-author" v-loading="loading">
        <div class="w-author-wrapper el-popover" v-if="data" :style="{ backgroundImage: `url(${bg})` }">
            <div class="u-author">
                <Avatar
                    class="u-avatar"
                    :uid="uid"
                    :url="data.user_avatar"
                    :size="68"
                    :frame="data.user_avatar_frame"
                />
                <div class="u-info">
                    <a class="u-name" :href="authorLink(uid)" target="_blank">
                        <el-tooltip class="item" effect="dark" content="签约作者" placement="top" v-if="isSuperAuthor">
                            <a class="u-superauthor" href="/dashboard/cooperation" target="_blank">
                                <img :src="super_author_icon" alt="superauthor" />
                            </a>
                        </el-tooltip>
                        <span class="u-displayname" :title="data.display_name">{{ data.display_name || "未知" }}</span>
                    </a>
                    <div class="u-extend">
                        <el-tooltip class="item" effect="dark" placement="top">
                            <template #content>
                                <span class="u-tips">经验值：{{ data.experience }}</span>
                            </template>
                            <span
                                class="u-level"
                                :class="'lv-' + level"
                                :style="{
                                    backgroundColor: showLevelColor(level),
                                }"
                                >Lv.{{ level }}</span
                            >
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="vipTypeTitle" placement="top" v-if="isVip">
                            <a class="u-vip" href="/vip/premium?from=sidebar_author" target="_blank">
                                <i class="i-icon-vip on">{{ vipType }}</i>
                            </a>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <!-- <div class="u-honor" :style="honorStyle" v-if="honor">{{ honor }}</div> -->
            <div class="u-trophy" v-if="hasTrophy">
                <div class="u-medals" v-if="medals && medals.length">
                    <medal :medals="medals" :showIcon="showMedalIcon"></medal>
                </div>
            </div>
            <div class="u-teams" v-if="teams && teams.length">
                <a class="u-team" v-for="(item, i) in teams" :key="i" :href="teamLink(item.team_id)" target="_blank">
                    <img class="u-team-logo" :src="showTeamLogo(item.team_logo)" />
                    <span class="u-team-name">{{ item.team_name }}@{{ item.team_server }}</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import { authorLink, getLink, getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { getUserInfo, getUserMedals, getUserPublicTeams } from "../../../service/author";
import { getDecoration, getDecorationJson } from "../../../service/cms";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import Avatar from "./Avatar.vue";
import medal from "./Medal.vue";
const { __imgPath, __userLevelColor } = JX3BOX;

const ATCARD_KEY = "decoration_atcard";
const DECORATION_JSON = "decoration_json";
const DECORATION_KEY = "decoration_me";
const HONOR_KEY = "honor_me";
export default {
    name: "AuthorComponent",
    components: {
        medal,
        Avatar,
    },
    props: ["uid"],
    data: () => ({
        data: null,
        medals: [],
        teams: [],
        loading: false,
        bg: "",
        honor: "",
        honorStyle: {},
    }),
    computed: {
        super_author_icon: function () {
            return __imgPath + "image/user/" + "superauthor.svg";
        },
        isVip: function () {
            return this.data?.is_pro || this.data?.is_pre;
        },
        vipTypeTitle: function () {
            return this.data?.is_pro ? "专业版会员" : "高级版会员";
        },
        vipType: function () {
            return this.data?.is_pro ? "PRO" : "PRE";
        },
        level: function () {
            return User.getLevel(this.data && this.data.experience);
        },
        hasTrophy: function () {
            return this.medals.length;
        },
        isSuperAuthor: function () {
            return !!this.data?.sign;
        },
    },
    watch: {
        uid: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.loadData();
                    this.getAtcard();
                    // this.getHonor();
                }
            },
        },
    },
    methods: {
        loadData: function () {
            const promises = [getUserInfo(this.uid), getUserMedals(this.uid), getUserPublicTeams(this.uid)];
            this.loading = true;
            Promise.all(promises).then((res) => {
                this.data = res[0];
                this.medals = res[1];
                this.teams = res[2];
                this.loading = false;
            });
        },
        loadUserInfo: function () {
            return getUserInfo(this.uid).then((data) => {
                this.data = data;
            });
        },
        loadMedals: function () {
            return getUserMedals(this.uid).then((data) => {
                this.medals = data;
            });
        },
        loadTeams: function () {
            return getUserPublicTeams(this.uid).then((data) => {
                this.teams = data && data.slice(0, 5);
            });
        },
        getAtcard() {
            let decoration_atcard = sessionStorage.getItem(ATCARD_KEY + this.uid);
            if (decoration_atcard == "no") {
                this.bg = "";
                return;
            }
            //已有缓存，读取解析
            if (decoration_atcard) {
                this.setDecoration(decoration_atcard);
                return;
            }
            getDecoration({ using: 1, user_id: this.uid, type: "atcard" }).then((data) => {
                let res = data.data.data;
                if (res.length == 0) {
                    //空 则为无主题，不再加载接口，界面设No
                    sessionStorage.setItem(ATCARD_KEY + this.uid, "no");
                    this.bg = "";
                    return;
                }
                sessionStorage.setItem(ATCARD_KEY + this.uid, res[0].val);
                this.setDecoration(res[0].val);
            });
        },
        setDecoration(val) {
            this.bg = this.showDecoration(val, "atcard");
        },
        getHonor() {
            this.honor = "";
            let user_id = this.uid;
            if (!user_id) {
                return;
            }
            let honor_local = sessionStorage.getItem(HONOR_KEY + user_id);
            if (honor_local == "no") return;
            //已有缓存，读取解析
            if (honor_local) {
                this.honor = honor_local;
                this.getHonorStyle();
                return;
            }
            getDecoration({ using: 1, user_id: user_id, type: "honor" }).then((data) => {
                let res = data.data.data;
                if (res.length == 0) {
                    //空 则为无主题，不再加载接口，界面设No
                    sessionStorage.setItem(HONOR_KEY + user_id, "no");
                    return;
                }
                let honor = res[0];
                sessionStorage.setItem(HONOR_KEY + user_id, honor.val);
                this.honor = honor.val;
                this.getHonorStyle();
            });
        },
        //有称号后，获取样式配置
        getHonorStyle() {
            let user_id = this.uid;
            let decoration_local = sessionStorage.getItem(DECORATION_KEY + user_id);
            if (decoration_local) {
                //解析本地缓存
                let decoration_parse = JSON.parse(decoration_local);
                if (!decoration_parse.status) return;

                if (decoration_parse) {
                    this.setHonorStyle(decoration_parse);
                    return;
                }
            }
            getDecoration({ using: 1, user_id: user_id, type: "homebg" }).then((data) => {
                let res = data.data.data;
                if (res.length == 0) {
                    //空 则为无主题，不再加载接口，界面设No
                    sessionStorage.setItem(DECORATION_KEY + user_id, JSON.stringify({ status: false }));
                    return;
                }
                let decoration = res[0];
                let decorationJson = sessionStorage.getItem(DECORATION_JSON);
                if (!decorationJson) {
                    //加载远程json，用于Honor颜色配置
                    getDecorationJson().then((json) => {
                        let decoration_json = json.data;
                        let theme = JSON.parse(JSON.stringify(decoration_json[decoration.val]));
                        theme.status = true;
                        sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(theme));
                        //缓存远程JSON文件
                        sessionStorage.setItem(DECORATION_JSON, JSON.stringify(decoration_json));
                        this.setHonorStyle(theme);
                    });
                } else {
                    let theme = JSON.parse(decorationJson)[decoration.val];
                    theme.status = true;
                    sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(theme));
                    this.setHonorStyle(theme);
                }
            });
        },
        setHonorStyle(style) {
            this.honorStyle = {
                "background-color": style.buttoncolor,
                color: style.buttontextcolor,
            };
        },

        showMedalIcon: function (val) {
            return __imgPath + "image/medals/user/" + val + ".gif";
        },
        showMedalDesc: function (item) {
            return item.medal_desc
        },
        teamLink: function (team_id) {
            return getLink("org", team_id);
        },
        showTeamLogo: function (val) {
            return getThumbnail(val, 96);
        },
        showLevelColor: function (level) {
            return __userLevelColor[level];
        },
        showDecoration: function (val, type) {
            return __imgPath + `decoration/images/${val}/${type}.png`;
        },
        authorLink,
    },
};
</script>

<style lang="less">
@import "../../../assets/css/module/author.less";
.w-author {
    .w-author-wrapper {
        background-repeat: no-repeat;
        background-position: top right;
        background-size: 100% auto;
        .u-author {
            padding: 5px 0 15px 5px;
        }
        .u-avatar {
            .fl;
            .mr(15px);
        }
        img {
            border: none;
            margin: 0;
            padding: 0;
        }
        a {
            .lh(28px);
            text-decoration: none;
            &:hover {
                text-decoration: none;
                box-shadow: none;
            }
        }
        .u-displayname {
            .fz(15px);
            .nobreak;
            max-width: 200px;
            color: @color;
            .bold;
        }
    }
    .u-honor {
        .mt(2px);
        .dbi;
        .h(18px);
        background-color: #494038;
        color: #ffffff;
        .fz(12px,14px);
        padding: 2px 50px 2px 10px;
        .mb(15px);
        .r(2px);
    }
}
</style>

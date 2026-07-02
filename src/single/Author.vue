<template>
    <div class="c-author" :style="decorationStyles">
        <AuthorInfo :uid="uid" :anonymous="anonymous" @ready="installModules" />
        <template v-if="data">
            <div class="u-interact">
                <!-- <AuthorFollow style="margin-right: 8px;" :uid="uid" /> -->
                <AuthorRss :uid="uid" :data="data" />
                <!-- <AuthorGift :uid="uid" /> -->
                <el-button class="u-btn" size="small" @click="onMessage" icon="Message">{{
                    $jx3boxT("jx3boxUi.author.message", "私信")
                }}</el-button
                >
            </div>
            <!-- <AuthorLink class="u-block u-links" :uid="uid" :data="data" /> -->
            <AuthorRole class="u-block u-roles" :data="data" />
            <AuthorMedals class="u-block u-trophy" :uid="uid" />
            <!-- <AuthorTeams class="u-block u-teams" :uid="uid" /> -->
            <!-- <AuthorFans class="u-block u-fans" :uid="uid" /> -->
            <slot></slot>
            <AuthorPosts class="u-block u-posts" :uid="uid" />
        </template>
    </div>
</template>

<script>
import AuthorInfo from "../author/AuthorInfo.vue";
// import AuthorLink from "../author/AuthorLink.vue";
// import AuthorFollow from "../author/AuthorFollow.vue";
// import AuthorGift from "../author/AuthorGift.vue";
// import AuthorFans from "../author/AuthorFans.vue";
import AuthorRole from "../author/AuthorRole.vue";
import AuthorMedals from "../author/AuthorMedals.vue";
// import AuthorTeams from "../author/AuthorTeams.vue";
import AuthorPosts from "../author/AuthorPosts.vue";
import AuthorRss from "../author/AuthorRss.vue";
import { getUserSkin } from "../../service/cms";
import i18nMixin from "../../i18n/mixin";
const jx3box = require("@jx3box/jx3box-common/data/jx3box.json");
const { __cdn } = jx3box;
const SKIN_POSITION_MAP = {
    lt: "left top",
    ct: "center top",
    mt: "center top",
    rt: "right top",
    lc: "left center",
    ml: "left center",
    cc: "center center",
    cm: "center center",
    mm: "center center",
    o: "center center",
    rc: "right center",
    mr: "right center",
    lb: "left bottom",
    cb: "center bottom",
    mb: "center bottom",
    rb: "right bottom",
};
export default {
    name: "AuthorComp",
    mixins: [i18nMixin],
    props: {
        uid: {
            type: [Number, String],
            default: 0,
        },
        anonymous: {
            type: [Number, String],
            default: 0,
        },
    },
    data: function () {
        return {
            data: "",
            sidebarSkin: "",
            sidebarSkinPosition: "",
        };
    },
    computed: {
        decorationStyles() {
            return this.sidebarSkin
                ? {
                      backgroundImage: `url(${this.sidebarSkin})`,
                      backgroundPosition: this.sidebarSkinPosition,
                  }
                : null;
        },
    },
    watch: {
        uid() {
            this.sidebarSkin = "";
            this.sidebarSkinPosition = "";
            this.loadSidebarSkin();
        },
    },
    created() {
        this.loadSidebarSkin();
    },
    methods: {
        installModules: function (data) {
            if (this.anonymous == 1) {
                return;
            }
            this.data = data;
        },
        onMessage: function () {
            window.open("/dashboard/letter?receiver=" + this.uid, "_blank");
        },
        resolveSkinDetail(record) {
            if (!record) {
                return null;
            }

            const skins = Array.isArray(record.skins) ? record.skins : [];
            return skins.find((item) => item && item.subtype === "pc_sidebar" && item.image) || null;
        },
        normalizeSkinImage(image) {
            if (!image) {
                return "";
            }

            const url = String(image).trim();
            if (/^(https?:)?\/\//.test(url)) {
                return url;
            }

            return __cdn + url.replace(/^\/+/, "");
        },
        resolveSkinPosition(position) {
            return SKIN_POSITION_MAP[position] || position || "";
        },
        setSidebarSkin(record) {
            const detail = this.resolveSkinDetail(record);
            const image = this.normalizeSkinImage(detail?.image);
            if (!image) {
                return false;
            }

            this.sidebarSkin = image;
            this.sidebarSkinPosition = this.resolveSkinPosition(detail.position);
            return true;
        },
        loadSidebarSkin() {
            if (!this.uid || this.anonymous == 1) {
                return;
            }

            getUserSkin(this.uid).then((res) => {
                const records = res.data.data || [];
                const record = records.find((item) => this.resolveSkinDetail(item));
                if (record && this.setSidebarSkin(record)) {
                    return;
                }
            });
        },
    },
    components: {
        AuthorInfo,
        // AuthorLink,
        // AuthorFollow,
        // AuthorGift,
        AuthorRole,
        AuthorMedals,
        // AuthorTeams,
        AuthorPosts,
        // AuthorFans,
        AuthorRss,
    },
};
</script>

<style lang="less">
/* src/single/Author.vue */
@import "../../assets/css/single/author.less";
</style>

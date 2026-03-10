<template>
    <div class="c-author">
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
            <AuthorMedals class="u-block u-trophy" :uid="uid" />
            <!-- <AuthorTeams class="u-block u-teams" :uid="uid" />
            <AuthorFans class="u-block u-fans" :uid="uid" /> -->
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
import AuthorMedals from "../author/AuthorMedals.vue";
// import AuthorTeams from "../author/AuthorTeams.vue";
import AuthorPosts from "../author/AuthorPosts.vue";
import AuthorRss from "../author/AuthorRss.vue";
import i18nMixin from "../../i18n/mixin";
const jx3box = require("@jx3box/jx3box-common/data/jx3box.json");
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
        };
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
    },
    components: {
        AuthorInfo,
        // AuthorLink,
        // AuthorFollow,
        // AuthorGift,
        AuthorMedals,
        // AuthorTeams,
        AuthorPosts,
        // AuthorFans,
        AuthorRss,
    },
};
</script>

<style lang="less">
@import "../../assets/css/single/author.less";
</style>

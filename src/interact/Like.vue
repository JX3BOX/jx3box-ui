<template>
    <div class="w-like2" :class="{ disabled: !status }" @click="addLike" v-if="ready">
        <el-tooltip effect="dark" :content="$jx3boxT('jx3boxUi.like.like', '点赞')" placement="top-start">
            <div class="w-like2__trigger">
                <img class="u-icon" svg-inline :src="iconPath" />
                <span class="u-count" v-if="count">{{ count }}</span>
            </div>
        </el-tooltip>
    </div>
</template>

<script>
import { postStat, getStat } from "@jx3box/jx3box-common/js/stat";
import JX3BOX  from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "LikeComp",
    mixins: [i18nMixin],
    props: {
        postType: {
            type: String,
            default: "",
        },
        postId: {
            type: [String, Number],
            default: "",
        },
    },
    data: function () {
        return {
            status: true,
            count: 0,
        };
    },
    computed: {
        ready() {
            return this.postType && this.postId;
        },
        iconPath() {
            return JX3BOX.__cdn + "design/vector/icon/like.svg"
        },
    },
    methods: {
        init: function () {
            if (!this.ready) return;
            this.loadStat();
        },
        loadStat: function () {
            getStat(this.postType, this.postId).then((res) => {
                this.count = res.data.likes || 0;
            });
        },
        // 点赞
        addLike: function () {
            if (!this.ready) return;
            this.count++;
            if (this.status) {
                postStat(this.postType, this.postId, "likes");
            }
            this.status = false;
        },
    },
    watch: {
        postId: {
            immediate: true,
            handler: function () {
                this.init();
            },
        },
        postType: function () {
            this.init();
        },
    },
};
</script>

<style lang="less">
/* src/interact/Like.vue */
@import "../../assets/css/interact/like2.less";
</style>

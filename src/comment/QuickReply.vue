<template>
    <div class="c-jx3box-reply">
        <el-popover
            :visible-arrow="true"
            placement="top"
            ref="quickReply"
            trigger="click"
            popper-class="c-jx3box-reply-pop"
            width="300px"
        >
            <div class="c-jx3box-reply-pop__content">
                <el-icon class="u-close" @click="closePop"><Close></Close></el-icon>
                <div class="u-title">{{ $jx3boxT("jx3boxUi.quickReply.title", "快捷回复") }}</div>
                <div class="m-reply-list">
                    <div
                        class="m-reply-list__item"
                        v-for="(item, index) in replyTemplate"
                        :key="index"
                        @click="reply(item)"
                    >
                        {{ item }}
                    </div>
                </div>
            </div>
            <template #reference>
                <img
                    class="u-reference"
                    svg-inline
                    width="24"
                    height="24"
                    src="../../assets/img/comment/comment.svg"
                    alt="comment"
                />
            </template>
        </el-popover>
    </div>
</template>

<script>
import replyTemplate from "../../assets/data/reply_template.json";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "QuickReply",
    mixins: [i18nMixin],
    data() {
        return {
            replyTemplate,
        };
    },
    emits: ["reply"],
    methods: {
        // 关闭弹窗
        closePop() {
            if (this.$refs.quickReply) {
                this.$refs.quickReply?.hide();
            }
        },
        reply(item) {
            this.$emit("reply", item);
            this.closePop();
        },
    },
};
</script>

<style lang="less">
/* src/comment/QuickReply.vue */
@import "../../assets/css/comment/quick-reply.less";
</style>

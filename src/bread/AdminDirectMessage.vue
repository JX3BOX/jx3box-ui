<template>
    <a
        class="u-message el-button el-button--warning el-button--medium u-op-public"
        @click="onButtonClick"
        v-if="isEditor"
    >
        <el-icon><Message></Message></el-icon>
        <span>{{ $jx3boxT("jx3boxUi.adminDirectMessage.button", "私信") }}</span>
    </a>
</template>

<script>
import { sendMessage } from "../../service/admin";
import User from "@jx3box/jx3box-common/js/user";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "AdminDirectMessage",
    mixins: [i18nMixin],
    props: {
        size: {
            type: String,
            default: "default",
        },
        sourceId: {
            type: Number,
            default: 0,
        },
        sourceType: {
            type: String,
            default: "",
        },
        userId: {
            type: Number,
            default: 0,
        },
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
    },
    methods: {
        onButtonClick() {
            this.$prompt(
                this.$jx3boxT("jx3boxUi.adminDirectMessage.input", "请输入私信内容"),
                this.$jx3boxT("jx3boxUi.adminDirectMessage.title", "管理私信"),
                {
                confirmButtonText: this.$jx3boxT("jx3boxUi.common.confirm", "确定"),
                cancelButtonText: this.$jx3boxT("jx3boxUi.common.cancel", "取消"),
                inputPlaceholder: this.$jx3boxT("jx3boxUi.adminDirectMessage.input", "请输入私信内容"),
                inputValidator: (value) => {
                    if (!value) {
                        return this.$jx3boxT("jx3boxUi.adminDirectMessage.input", "请输入私信内容");
                    }
                },
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        const data = {
                            source_id: this.sourceId,
                            source_type: this.sourceType,
                            user_id: this.userId,
                            content:
                                this.$jx3boxT("jx3boxUi.adminDirectMessage.noticePrefix", "运营通知：") +
                                instance.inputValue,
                            type: "system",
                            subtype: "admin_message"
                        };
                        sendMessage(data).then(() => {
                            this.$message.success(this.$jx3boxT("jx3boxUi.adminDirectMessage.success", "私信成功"));
                            done();
                        })
                    } else {
                        done();
                    }
                }
            })
        }
    }
}
</script>

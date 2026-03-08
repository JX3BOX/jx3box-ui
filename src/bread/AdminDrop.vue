<template>
    <div class="c-admin-drop">
        <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary" class="c-admin-button c-admin-drop__button" :size="buttonSize" icon="Setting">
                管理 <el-icon style="margin-left: 5px"><ArrowDown></ArrowDown></el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-if="isEditor" command="toggleAdminPanel" icon="Setting">
                        <span>设置</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="isEditor" command="directMessage" icon="Message">
                        <span>私信</span>
                    </el-dropdown-item>
                    <el-dropdown-item icon="UploadFilled" command="designTask" v-if="hasPermission('push_banner')">
                        <span>推送</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="showRobotPic" icon="Refresh" command="pictureTask">
                        <span>刷图</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>

        <design-task v-model="showDesignTask" :post="post"></design-task>
    </div>
</template>

<script>
import Bus from "../../utils/bus";
import User from "@jx3box/jx3box-common/js/user";
import DesignTask from "./DesignTask.vue";
import { sendMessage } from "../../service/admin";
import { refreshQQBotImage } from "../../service/cms";
export default {
    name: "AdminDrop",
    components: {
        DesignTask,
    },
    props: {
        buttonSize: {
            type: String,
            default: "default",
        },
        post: {
            type: Object,
            default: () => {},
        },
        userId: {
            type: Number,
            default: 0,
        },
        showRobotPic: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showDesignTask: false,
        };
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
        sourceId() {
            return this.post?.ID;
        },
        sourceType() {
            return this.post?.post_type;
        },
    },
    methods: {
        handleCommand(command) {
            this[command]();
        },
        toggleAdminPanel() {
            Bus.emit("toggleAdminPanel");
        },
        directMessage() {
            this.$prompt("请输入私信内容", "管理私信", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPlaceholder: "请输入私信内容",
                inputValidator: (value) => {
                    if (!value) {
                        return "请输入私信内容";
                    }
                },
                beforeClose: (action, instance, done) => {
                    if (action === "confirm") {
                        const data = {
                            source_id: String(this.sourceId),
                            source_type: this.sourceType,
                            user_id: this.userId,
                            content: "运营通知：" + instance.inputValue,
                            type: "system",
                            subtype: "admin_message",
                        };
                        sendMessage(data).then(() => {
                            this.$message.success("私信成功");
                            done();
                        });
                    } else {
                        done();
                    }
                },
            }).catch(() => {});
        },
        designTask() {
            this.showDesignTask = true;
        },
        pictureTask() {
            const pathname = location.pathname;
            // 适用于pvp/1234 horse/1_234 等
            const pattern = /\/([^/]+)\/([\d_]+)/;
            const match = pathname.match(pattern);
            let task_type = "";
            let task_target_id = "";
            if (match) {
                task_type = match[1];
                task_target_id = match[2];
            }
            if (task_type && task_target_id) {
                refreshQQBotImage({
                    task_type,
                    task_target_id,
                }).then((res) => {
                    if (!res.data.code) {
                        this.$message.success("QQ机器人图片生成提交成功");
                    }
                });
            } else {
                this.$message.error("参数不正确");
            }
        },
        hasPermission(permission) {
            return User.hasPermission(permission);
        },
    },
};
</script>

<style lang="less">
.c-admin-drop {
    float: right;
    margin-top: -2px;
    margin-right: 10px;
}
.c-admin-drop__button {
    padding: 8px 18px !important;
    align-items: center;
}
</style>

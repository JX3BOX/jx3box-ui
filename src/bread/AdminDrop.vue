<template>
    <div class="c-admin-drop">
        <el-dropdown trigger="click" @command="handleCommand">
            <el-button type="primary" class="c-admin-button c-admin-drop__button" :size="buttonSize" icon="Setting">
                {{ $jx3boxT("jx3boxUi.adminDrop.manage", "管理") }}
                <el-icon style="margin-left: 5px"><ArrowDown></ArrowDown></el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item
                        v-if="!isCommunity && hasPermission('update_post')"
                        command="toggleAdminPanel"
                        icon="Setting"
                    >
                        <span>{{ $jx3boxT("jx3boxUi.adminDrop.setting", "设置") }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-else-if="isCommunity" command="toggleCommunityAdminPanel" icon="Setting">
                        <span>{{ $jx3boxT("jx3boxUi.adminDrop.setting", "设置") }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="hasPermission('update_post') && !isCommunity"
                        command="editPost"
                        icon="Edit"
                    >
                        <span>{{ $jx3boxT("jx3boxUi.adminDrop.edit", "编辑") }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="hasPermission('create_system_message')"
                        command="directMessage"
                        icon="Message"
                    >
                        <span>{{ $jx3boxT("jx3boxUi.adminDrop.message", "私信") }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-if="hasPermission('manage_post_move') && showMove"
                        command="onMoveToCommunity"
                        icon="Refresh"
                    >
                        <span>转移</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="migrate" v-if="isCommunity" icon="Refresh">
                        <span>迁移</span>
                    </el-dropdown-item>
                    <el-dropdown-item icon="UploadFilled" command="designTask" v-if="hasPermission('push_banner')">
                        <span>{{ $jx3boxT("jx3boxUi.adminDrop.push", "推送") }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item v-if="showRobotPic" icon="Refresh" command="pictureTask">
                        <span>{{ $jx3boxT("jx3boxUi.adminDrop.pictureTask", "刷图") }}</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>

        <design-task v-model="showDesignTask" :post="post"></design-task>
        <CommunityAdmin v-model="communityAdminVisible" :postId="post && post.id" />
        <MoveToCommunityDialog v-model="moveVisible" :post="post" />
        <MigrateCommunity v-model="showMigrate" :communityId="sourceId" />
    </div>
</template>

<script>
import Bus from "../../utils/bus";
import User from "@jx3box/jx3box-common/js/user";
import DesignTask from "./DesignTask.vue";
import MoveToCommunityDialog from "./MoveToCommunityDialog.vue";
import MigrateCommunity from "./MigrateCommunity.vue";
import CommunityAdmin from "./CommunityAdmin.vue";
import { sendMessage } from "../../service/admin";
import { refreshQQBotImage } from "../../service/cms";
import i18nMixin from "../../i18n/mixin";
export default {
    name: "AdminDrop",
    mixins: [i18nMixin],
    components: {
        DesignTask,
        MoveToCommunityDialog,
        MigrateCommunity,
        CommunityAdmin,
    },
    props: {
        isCommunity: {
            type: Boolean,
            default: false,
        },
        showMove: {
            type: Boolean,
            default: false,
        },
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
            moveVisible: false,
            communityAdminVisible: false,
            showDesignTask: false,
            showMigrate: false,
        };
    },
    computed: {
        isEditor() {
            return User.isEditor();
        },
        sourceId() {
            if (this.isCommunity) {
                return this.post?.id;
            } else {
                return this.post?.ID;
            }
        },
        sourceType() {
            if (this.isCommunity) {
                return "community";
            } else {
                return this.post?.post_type;
            }
        },
        edit_link: function () {
            return editLink(this.post?.post_type, this.post?.ID);
        },
    },
    methods: {
        handleCommand(command) {
            this[command]();
        },
        toggleCommunityAdminPanel() {
            this.communityAdminVisible = true;
        },
        toggleAdminPanel() {
            Bus.emit("toggleAdminPanel");
        },
        onMoveToCommunity() {
            this.moveVisible = true;
        },
        directMessage() {
            this.$prompt(
                this.$jx3boxT("jx3boxUi.adminDrop.messageInput", "请输入私信内容"),
                this.$jx3boxT("jx3boxUi.adminDrop.messageTitle", "管理私信"),
                {
                    confirmButtonText: this.$jx3boxT("jx3boxUi.common.confirm", "确定"),
                    cancelButtonText: this.$jx3boxT("jx3boxUi.common.cancel", "取消"),
                    inputPlaceholder: this.$jx3boxT("jx3boxUi.adminDrop.messageInput", "请输入私信内容"),
                    inputValidator: (value) => {
                        if (!value) {
                            return this.$jx3boxT("jx3boxUi.adminDrop.messageInput", "请输入私信内容");
                        }
                    },
                    beforeClose: (action, instance, done) => {
                        if (action === "confirm") {
                            const data = {
                                source_id: String(this.sourceId),
                                source_type: this.sourceType,
                                user_id: this.userId,
                                content:
                                    this.$jx3boxT("jx3boxUi.adminDrop.noticePrefix", "运营通知：") +
                                    instance.inputValue,
                                type: "system",
                                subtype: "admin_message",
                            };
                            sendMessage(data).then(() => {
                                this.$message.success(this.$jx3boxT("jx3boxUi.adminDrop.messageSuccess", "私信成功"));
                                done();
                            });
                        } else {
                            done();
                        }
                    },
                }
            ).catch(() => {});
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
                        this.$message.success(
                            this.$jx3boxT("jx3boxUi.adminDrop.pictureSuccess", "QQ机器人图片生成提交成功")
                        );
                    }
                });
            } else {
                this.$message.error(this.$jx3boxT("jx3boxUi.adminDrop.invalidParams", "参数不正确"));
            }
        },
        editPost() {
            location.href = this.edit_link + "?from=admin";
        },
        hasPermission(permission) {
            return User.hasPermission(permission);
        },
        migrate() {
            this.showMigrate = true;
        },
    },
};
</script>

<style lang="less">
/* src/bread/AdminDrop.vue */
.c-admin-drop {
    .c-admin-drop__button {
        // padding: 8px 12px !important;
        // align-items: center;
    }
}
</style>

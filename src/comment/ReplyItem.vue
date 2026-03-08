<template>
    <el-row>
        <!--用户头像-->
        <CommentAvatar
            :user-avatar="showAvatar(reply.avatar)"
            :user-href="profileLink(reply.userId)"
            :username="reply.displayName"
            :avatarFrame="reply.user_avatar_frame"
            :avatarSize="36"
        />
        <!--评论主体内容-->
        <CommentContentSimple
            :comment-id="reply.id"
            :date="reply.commentDate"
            :content="reply.content"
            :attachments="stringToArray(reply.attachments)"
            :can-delete="power.can_del || power.uid == reply.userId"
            :can-hide="power.is_author == 1 || power.is_editor == 1"
            :can-reply="power.uid != reply.userId"
            :user-href="profileLink(reply.replyForUID)"
            :reply-for-username="reply.replyForUsername"
            :reply-for-user-id="reply.replyForUID"
            :is-like="reply.is_likes == 1"
            :likes="~~reply.likes"
            @delete="deleteReply"
            @showReplyInput="showReplyForReplyFrom = !showReplyForReplyFrom"
            @setLikeComment="setLikeComment"
            @hide="hideReply"
        />
        <!--隐藏起来的回复评论的评论表单-->
        <ReplyForReply
            v-if="showReplyForReplyFrom"
            :username="reply.displayName"
            :user-href="profileLink(reply.userId)"
            :current-id="reply.id"
            @hideForm="showReplyForReplyFrom = false"
            @doReply="doReply"
        />
    </el-row>
</template>

<script>
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import CommentContentSimple from "./CommentContentSimple.vue";
import ReplyForReply from "./ReplyForReply.vue";
import CommentAvatar from "./Avatar.vue";

export default {
    props: ["reply", "power"],
    components: {
        CommentAvatar,
        CommentContentSimple,
        ReplyForReply,
    },
    backReplyList: [],
    data: function () {
        return {
            showReplyForReplyFrom: false,
            decoration: "",
        };
    },
    methods: {
        profileLink: function (uid) {
            return authorLink(uid);
        },
        stringToArray: function (str) {
            if (!str) {
                return [];
            }
            return JSON.parse(str);
        },
        showAvatar: function (val) {
            return showAvatar(val, 84);
        },
        deleteReply(id) {
            this.$emit("deleteReply", id);
        },
        hideReply(id) {
            this.$emit("hide", id);
        },
        setLikeComment(setLike) {
            this.$emit("setLikeComment", this.reply.id, setLike);
        },
        doReply(replyData) {
            (replyData.replyForUID = this.reply.userId),
                (replyData.replyForCommentId = this.reply.id),
                this.$emit("addReply", replyData);
            this.showReplyForReplyFrom = false;
        },
    },
};
</script>

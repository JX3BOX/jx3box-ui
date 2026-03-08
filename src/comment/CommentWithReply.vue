<template>
    <div class="c-comment-cmt">
        <div class="c-comment-cmt__box" :style="decorationStyles">
            <CommentAvatar
                :user-avatar="showAvatar(item.avatar)"
                :user-href="profileLink(item.userId)"
                :username="item.displayName"
                :avatarFrame="item.user_avatar_frame"
                :withFrame="true"
                :avatarSize="48"
            />
            <div class="u-flex-1">
                <div class="c-comment-cmt__author">
                    <el-link class="u-name" type="primary" target="_blank" :href="userHref">{{
                        username || "人字榜800线无名小侠"
                    }}</el-link>
                    <span class="u-mark u-top" v-if="item.is_top"
                        ><el-icon><Download></Download></el-icon>置顶</span
                    >
                    <span class="u-mark u-star" v-if="item.is_star"
                        ><el-icon><Star></Star></el-icon>精华</span
                    >
                    <span class="u-mark u-secret" v-if="item.is_secret"
                        ><el-icon><Cherry></Cherry></el-icon>悄悄话</span
                    >
                </div>
                <CommentContent
                    :date="item.commentDate"
                    :content="item.content"
                    :comment-id="item.id"
                    :attachments="stringToArray(item.attachments)"
                    :can-delete="power.can_del || power.uid == item.userId"
                    :can-set-top="(power.is_author || power.is_editor) && !item.is_top"
                    :can-cancel-top="(power.is_author || power.is_editor) && item.is_top"
                    :can-set-star="!item.is_star && (power.is_author || power.is_editor)"
                    :can-cancel-star="item.is_star && (power.is_author || power.is_editor)"
                    :can-add-white="!item.is_white && power.article_open_white == 1"
                    :can-remove-white="item.is_white && (power.is_author == 1 || power.is_editor == 1)"
                    :can-hide="power.is_author == 1 || power.is_editor == 1"
                    :is-like="item.is_likes == 1"
                    :likes="~~item.likes"
                    @addNewReply="addNewReply"
                    @deleteComment="deleteComment"
                    @setTopComment="setTopComment"
                    @setStarComment="setStarComment"
                    @setLikeComment="setLikeComment"
                    @setWhiteComment="setWhiteComment"
                    @hide="hideComment"
                />
            </div>
        </div>
        <ReplyList
            :data="replyList"
            :pager="pager"
            :power="power"
            @addNewReply="addNewReply"
            @deleteReply="deleteReply"
            @goto="gotoReplyListIndex"
            @resetReply="resetReply"
            @setLikeComment="setLikeReply"
            @hide="hideComment"
        />
    </div>
</template>

<script>
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import CommentContent from "./CommentContent.vue";
import ReplyList from "./ReplyList.vue";
import { POST, DELETE, GET } from "../../service/comment";
import CommentAvatar from "../comment/Avatar.vue";
import { getDecoration } from "../../service/cms";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __imgPath } = JX3BOX;
const DECORATION_KEY = "decoration_comment_";
export default {
    props: ["item", "baseApi", "power", "user-href", "username"],
    components: {
        CommentContent,
        ReplyList,
        CommentAvatar,
    },
    emits: ["deleteComment", "setTopComment", "setStarComment", "addNewReply", "deleteReply", "goto", "resetReply"],
    data: function () {
        return {
            replyList: [],
            pager: {
                index: 1,
                pageSize: 10,
                pageTotal: 1,
                total: 0,
            },
            decoration: null,
        };
    },
    computed: {
        uid() {
            return this.item.userId;
        },
        decorationStyles() {
            return this.decoration
                ? {
                      backgroundImage: `url(${this.decoration})`,
                      borderRadius: "8px",
                  }
                : null;
        },
    },
    created() {
        this.replyList = this.item.reply || [];
        this.getDecoration();
    },
    methods: {
        setDecoration(decoration) {
            this.decoration = __imgPath + `decoration/images/${decoration.val}/comment.png`;
        },
        getDecoration() {
            let decoration_local = sessionStorage.getItem(DECORATION_KEY + this.uid);
            if (decoration_local) {
                //解析本地缓存
                let decoration_parse = JSON.parse(decoration_local);
                if (decoration_parse) {
                    this.setDecoration(decoration_parse);
                    this.decoration = __imgPath + `decoration/images/${decoration_parse.val}/comment.png`;
                    return;
                }
            }
            getDecoration({ using: 1, user_id: this.uid, type: "comment" }).then((res) => {
                let decorationList = res.data.data;
                //筛选个人装扮
                let decoration = decorationList.find((item) => item.type == "comment");
                if (decoration) {
                    this.decoration = __imgPath + `decoration/images/${decoration.val}/comment.png`;
                    sessionStorage.setItem(DECORATION_KEY + this.uid, JSON.stringify(decoration));
                    return;
                }
            });
        },
        profileLink: function (uid) {
            return authorLink(uid);
        },
        showAvatar: function (val) {
            return showAvatar(val, 144);
        },
        stringToArray: function (str) {
            if (!str) {
                return [];
            }
            return JSON.parse(str);
        },
        deleteComment() {
            this.$emit("deleteComment", this.item.id);
        },
        hideComment() {
            this.$emit("hide", this.item.id);
        },
        setTopComment(setTop) {
            this.$emit("setTopComment", this.item.id, setTop);
        },
        setStarComment(setStar) {
            this.$emit("setStarComment", this.item.id, setStar);
        },
        setLikeComment(setLike) {
            this.$emit("setLikeComment", this.item.id, setLike);
        },
        setLikeReply(id, setLike) {
            this.$emit("setLikeComment", id, setLike);
        },
        setWhiteComment(white) {
            this.$emit("setWhiteComment", this.item.id, white);
        },
        addNewReply(data) {
            POST(`${this.baseApi}/comment/${this.item.id}/reply`, null, data)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "评论成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right",
                    });

                    this.loadReplyList(this.pager.index);
                })
                .catch(() => {});
        },
        deleteReply(id) {
            DELETE(`${this.baseApi}/comment/${id}`)
                .then(() => {
                    this.$notify({
                        title: "",
                        message: "删除成功!",
                        type: "success",
                        duration: 3000,
                        position: "bottom-right",
                    });
                    this.loadReplyList(this.pager.index);
                })
                .catch(() => {});
        },
        gotoReplyListIndex(index) {
            this.loadReplyList(index, 6);
        },
        loadReplyList(index, pageSize) {
            GET(`${this.baseApi}/comment/${this.item.id}/reply/page/${index}?pageSize=${pageSize}`)
                .then((resp) => {
                    if (index == 1 && pageSize == 3) {
                        // eslint-disable-next-line vue/no-mutating-props
                        this.item.reply = resp.data || [];
                    }
                    this.replyList = resp.data || [];
                    this.pager = resp.page;
                })
                .catch(() => {});
        },
        resetReply() {
            this.loadReplyList(1, 3);
        },
    },
};
</script>

<style lang="less">
.c-comment-cmt {
    .u-name {
        margin-right: 6px;
    }
    .u-mark {
        font-style: normal;
        font-size: 12px;
        padding: 1px 5px 2px 5px;
        border-radius: 2px;
        color: #fff;
        margin-left: 5px;
        cursor: default;
    }
    .u-top {
        background-color: #6f42c1;
        i {
            transform: rotate(180deg);
        }
    }
    .u-star {
        background-color: #f39;
        i {
            margin-right: 2px;
        }
    }
    .u-secret {
        background-color: #ff99cc;
    }
}
.c-comment-cmt__box {
    display: flex;
    padding-top: 5px;
    background-size: cover;
    .u-flex-1 {
        flex: 1;
    }
}
</style>

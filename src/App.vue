<template>
    <div class="container-page">
        <Header></Header>
        <breadcrumb
            name="频道名称"
            slug="slug"
            root="/slug"
            :publishEnable="true"
            :feedbackEnable="true"
            :adminEnable="true"
            :crumbEnable="true"
        >
            <template #logo>
                <img svg-inline src="../assets/img/editor/jx3.svg" />
            </template>
            <template #op-prepend> </template>
        </breadcrumb>
        <LeftSidebar :open="true" :uid="7">
            <LeftSideToggle :mobileOnly="true" />
            <Author :uid="7" />
        </LeftSidebar>

        <Main :withoutLeft="false" :withoutRight="false">
            <versionBy value=""></versionBy>
            <el-divider></el-divider>
            <UploadAlum />
            <singlebox :post="post" />
            <SimpleThxVue
                postType="bbs"
                postTitle="bbs23865的标题"
                :userId="7"
                :adminBoxcoinEnable="true"
                :userBoxcoinEnable="true"
                :allowGift="true"
                :postId="57260"
            />
            <Thx
                postType="bbs"
                postTitle="bbs23865的标题"
                type="batchReward"
                :userId="7"
                :adminBoxcoinEnable="true"
                :userBoxcoinEnable="true"
                :postId="57260"
                :allowGift="true"
                :showRss="true"
            />
            <Comment category="post" id="80449"></Comment>
            <RightSidebar :show-toggle="true">
                <PostTopic type="bps" :id="48857"></PostTopic>
                <div id="directory"></div>
            </RightSidebar>

            <SuspendCommon
                :drawerOptions="{
                    author: {
                        name: '作者名字',
                        avatar: 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png',
                        author_id: 8,
                    },
                    subscribeType: 'posts',
                    postType: 'macro',
                    id: 97147,
                    title: '薄嘴唇靓仔！！！',
                }"
                @search="suspendSearch"
            >
                <template #default>
                    <div style="display: flex; gap: 1rem">
                        <div>切换</div>
                        <div>切换</div>
                        <div>切换</div>
                    </div>
                </template>
            </SuspendCommon>

            <CommonFooter> </CommonFooter>
        </Main>
    </div>
</template>

<script>
import singlebox from "./single/cms-single.vue";
import UploadAlum from "./editor/UploadAlum.vue";
import Author from "./single/Author.vue";
import SimpleThxVue from "./single/SimpleThx.vue";
import Comment from "./single/Comment.vue";
import Thx from "./single/Thx.vue";
// import PostHeader from "./single/PostHeader.vue";
import PostTopic from "./single/PostTopic.vue";
import axios from "axios";
import post_topics from "@jx3box/jx3box-common/data/post_topics.json";
import { get_item } from "../service/item";
// import AdminDirectMessage from "./bread/AdminDirectMessage.vue";
// import Admin from "@/bread/Admin.vue";
import versionBy from "./filters/versionBy.vue";
import SuspendCommon from "./SuspendCommon.vue";
import CommonFooter from "./CommonFooter.vue";
export default {
    name: "App",
    components: {
        SimpleThxVue,
        Author,
        Comment,
        Thx,
        // PostHeader,
        PostTopic,
        UploadAlum,
        // AdminDirectMessage,
        singlebox,
        versionBy,
        SuspendCommon,
        CommonFooter,
        // Admin,
    },
    data() {
        return {
            post_id: "74662",
            post: "",
            client: location.href.includes("origin") ? "origin" : "std",
            tag: "",
            post_topics: post_topics["bps_pve"],
            tag2: "",
            item1: null,
            item2: null,
            item3: null,
            item4: null,
            item5: null,
            item6: null,
        };
    },
    watch: {
        post_id: {
            immediate: true,
            handler: function () {
                this.loadPost();
            },
        },
    },
    methods: {
        suspendSearch: function (val) {
            console.log(val, "222");
        },
        update(data) {
            console.log(data);
        },
        loadPost() {
            axios.get(`/api/cms/post/${this.post_id}`).then((res) => {
                this.post = res.data.data;
                this.$forceUpdate();
            });
        },
        filterMeta(val) {
            console.log(val);
        },
        loadItems() {
            get_item("10_310").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item1 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("6_4396").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item2 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("10_202").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item3 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("10_98").then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item4 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("5_3028", 1).then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item5 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });

            get_item("5_3028", 2).then((res) => {
                let data = res.data;
                if (data.code === 200) {
                    let item = data.data.item;
                    this.item6 = JSON.stringify(item) !== "{}" ? item : null;
                }
            });
        },
    },
    mounted() {
        // this.loadItems();
    },
};
</script>

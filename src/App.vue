<template>
    <div class="container-page">
        <CommonHeader></CommonHeader>
        <breadcrumb
            name="频道名称"
            slug="bps"
            root="/slug"
            :publishEnable="true"
            :feedbackEnable="true"
            :adminEnable="true"
            :crumbEnable="true"
        >
            <template #logo>
                <img svg-inline src="../assets/img/editor/jx3.svg" />
            </template>
            bread info
            <template #op-prepend>
                <AdminDrop :post="community" :isCommunity="true" :user-id="8" :showMove="true" />
            </template>
        </breadcrumb>
        <LeftSidebar :open="true" :uid="8">
            <Author :uid="8" />
        </LeftSidebar>
        <Main :withoutLeft="false" :withoutRight="false">
            <el-tabs v-model="tab" type="card">
                <el-tab-pane label="通用组件" name="widget">
                    <h1 class="m-title">UC泛用组件</h1>
                    <div class="m-block">
                        <el-button @click="userpop = true" style="width: 100px">用户POP</el-button>
                        <UserPop title="添加用户" v-model="userpop"></UserPop>
                    </div>

                    <h1 class="m-title">奇怪的组件</h1>
                    <div class="m-block">
                        <Mark label="渊穷砂" BGL="#24292e" BGR="#ffadcb" value="按键启动"></Mark>
                    </div>
                    <h1 class="m-title">复制组件</h1>
                    <div class="m-block">
                        <Copy value="xfbsyxj">xfbsyxj</Copy>
                    </div>

                    <h1 class="m-title">切换侧边栏</h1>
                    <div class="m-block">
                        <LeftSideToggle :mobileOnly="false" />
                        <LeftSideToggle :mobileOnly="true" />
                    </div>

                    <h1 class="m-title">上传组件</h1>
                    <div class="m-block">
                        <UploadBanner v-model="uploadBanner" />
                    </div>

                    <h1 class="m-title">公共bottom</h1>
                    <div class="m-block">
                        <CommonBottom />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文章列表" name="list">
                    <h1 class="m-title">筛选</h1>
                    <div class="m-block">
                        <markBy />
                        <menuBy :data="['test1', 'test2']" />
                        <zlpBy />
                        <topicBy v-model="tag2" :topics="post_topics" />
                        <tagBy :data="['PVE', 'PVX']" :type="tag" />
                    </div>

                    <h2 class="m-title">客户端</h2>
                    <div class="m-block">
                        <clientBy type="" />
                        <versionBy value="" />
                    </div>

                    <h2 class="m-title">排序</h2>
                    <div class="m-block">
                        <orderBy />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文章详情" name="single">
                    <h1 class="m-title">Append</h1>
                    <div class="m-block">
                        <PostGuide :post="post" />
                    </div>
                    <h1 class="m-title">Comment</h1>
                    <div class="m-block">
                        <el-button @click="homeworkVisible = true" style="width: 100px" size="small"
                            >作业组件</el-button
                        >
                        <Homework
                            v-model="homeworkVisible"
                            post-type="comment"
                            :post-id="19382"
                            :userId="8719"
                            client="std"
                        ></Homework>
                    </div>
                    <h1 class="m-title">QRcode</h1>
                    <div class="m-block">
                        <QRcode v="cms" />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="文章内容" name="content">
                    <el-radio-group v-model="post_id">
                        <el-radio value="23240">临时测试</el-radio>
                        <el-radio value="35605">Markdown</el-radio>
                        <el-radio value="32035">仅小册</el-radio>
                        <el-radio value="30017">仅联合创作者</el-radio>
                        <el-radio value="30582">小册和联合创作者</el-radio>
                        <el-radio value="31129">无小册和联合创作者</el-radio>
                    </el-radio-group>
                    <singlebox :post="post" />
                </el-tab-pane>
                <el-tab-pane label="百科组件" name="wiki">
                    <h1 class="m-title">游戏价格组件</h1>
                    <div class="m-block">
                        <GamePrice :price="100009999" :align="true"></GamePrice>
                    </div>

                    <h1 class="m-title">百科面板</h1>
                    <div class="m-block">
                        <WikiPanel :wiki-post="wiki_post">
                            <template #head-title>奇遇攻略</template>
                        </WikiPanel>
                    </div>

                    <h1 class="m-title">百科评论</h1>
                    <div class="m-block">
                        <WikiComments :source-id="12572" type="achievement" />
                    </div>

                    <h1 class="m-title">百科修订</h1>
                    <div class="m-block">
                        <WikiRevisions type="achievement" :source-id="12572" />
                    </div>
                </el-tab-pane>
                <el-tab-pane label="移动组件" name="mobile">
                    <h1 class="m-title">Common</h1>
                    <el-switch v-model="showSuspendCommon" active-text="展示移动组件"></el-switch>
                    <div class="m-block">
                        <SuspendCommon
                            v-if="showSuspendCommon"
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
                    </div>
                </el-tab-pane>
            </el-tabs>
            <el-divider></el-divider>
            <RightSidebar :show-toggle="true" style="padding: 15px">
                <RightSideMsg>
                    <em>综合交流群</em> :
                    <strong class="u-link" title="点击复制">
                        <a>100473604</a>
                    </strong>
                </RightSideMsg>
                <PostTopic type="bps" :id="48857"></PostTopic>
                <div id="directory"></div>
                <PostVersion :post="post"></PostVersion>
                <PostCollection :id="59" />
            </RightSidebar>
        </Main>
        <CommonFooter> </CommonFooter>
    </div>
</template>

<script>
import { getPost } from "../service/cms";
import { get_item } from "../service/item";
import { getTopicDetails } from "../service/community";
import post_topics from "@jx3box/jx3box-common/data/post_topics.json";
import { wiki } from "@jx3box/jx3box-common/js/wiki.js";

// components
import singlebox from "./single/CmsSingle.vue";
import Author from "./single/Author.vue";
import PostTopic from "./single/PostTopic.vue";
import PostGuide from "./single/PostGuide.vue";
import Homework from "./interact/Homework.vue";
import PostVersion from "./single/PostVersion.vue";
import PostCollection from "./single/PostCollection.vue";
import QRcode from "./interact/QRcode.vue";
import UploadBanner from "./upload/UploadBanner.vue";
import Mark from "./interact/Mark.vue";
import Copy from "./interact/Copy.vue";

import GamePrice from "./wiki/GamePrice.vue";
import WikiComments from "./wiki/WikiComments.vue";
import WikiRevisions from "./wiki/WikiRevisions.vue";
import WikiPanel from "./wiki/WikiPanel.vue";
export default {
    name: "App",
    components: {
        Mark,
        Copy,
        Author,
        // PostHeader,
        PostTopic,
        // AdminDirectMessage,
        singlebox,
        // Admin,
        Homework,
        PostGuide,
        PostVersion,
        PostCollection,
        QRcode,
        UploadBanner,

        GamePrice,
        WikiComments,
        WikiRevisions,
        WikiPanel,
    },
    data() {
        return {
            tab: "content",

            post_id: "23240",
            post: "",
            client: location.href.includes("origin") ? "origin" : "std",
            item1: null,
            item2: null,
            item3: null,
            item4: null,
            item5: null,
            item6: null,

            // 列表
            tag: "post",
            post_topics: post_topics["pve"],
            tag2: "",

            // 通用
            userpop: false,
            homeworkVisible: false,

            showSuspendCommon: false,

            community: {},

            wiki_post: {
                source: {},
                post: null,
            },
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
            getPost(this.post_id).then((res) => {
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
        loadCommunity: function () {
            // 72
            getTopicDetails(4339).then((res) => {
                this.community = res.data.data;
            });
        },
        loadWiki() {
            wiki.mix({ type: "achievement", id: 12572, client: this.client }).then((res) => {
                const { post, source, compatible, isEmpty, users } = res;
                this.wiki_post = {
                    post: post,
                    source: source,
                    users,
                };
            });
        },
    },
    mounted() {
        // this.loadItems();
        this.loadCommunity();
        this.loadWiki();
    },
};
</script>
<style lang="less">
/* src/App.vue */
.m-title {
    margin: 20px 0 10px;
    font-size: 16px;
    font-weight: 500;
}
.m-block {
    padding: 15px;
    .flex;
    flex-direction: column;
    gap: 20px;
}
</style>

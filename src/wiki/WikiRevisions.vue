<template>
    <WikiPanel class="c-wiki-revisions" scene="detail">
        <template #head-title>
            <i class="u-icon el-icon-time"></i>
            <span class="u-txt">{{ $jx3boxT('jx3boxUi.wikiRevisions.title', '历史版本') }}</span>
        </template>
        <template #body>
            <div class="m-revisions-panel">
                <div class="u-empty" v-if="!versions || !versions.length">
                    <span v-if="versions === null">{{ $jx3boxT('jx3boxUi.wiki.loading', '🎉 数据加载中...') }}</span>
                    <span v-if="versions === false">{{ $jx3boxT('jx3boxUi.wiki.loadFailed', '⚠️ 数据加载异常') }}</span>
                    <span v-if="versions && !versions.length">{{ $jx3boxT('jx3boxUi.wiki.empty', '💧 暂无数据') }}</span>
                </div>
                <table v-if="versions && versions.length" class="m-histories">
                    <thead>
                        <tr>
                            <th>{{ $jx3boxT('jx3boxUi.wikiRevisions.version', '版本') }}</th>
                            <th>{{ $jx3boxT('jx3boxUi.wikiPanel.updatedAt', '更新时间') }}</th>
                            <th>{{ $jx3boxT('jx3boxUi.wikiRevisions.contributor', '贡献者') }}</th>
                            <th>{{ $jx3boxT('jx3boxUi.wikiRevisions.remark', '修订说明') }}</th>
                        </tr>
                    </thead>
                    <tr class="history" v-for="(ver, key) in versions" :key="key">
                        <td>
                            <a
                                :href="link(type, `${ver.source_id}/${ver.id}`)"
                                v-text="'v' + (versions.length - key)"
                                @click="redirectRevision(ver, $event)"
                            ></a>
                        </td>
                        <td v-text="ts2str(ver.updated)"></td>
                        <td>
                            <a :href="ver.user_id ? author_url(ver.user_id) : null" v-text="ver.user_nickname"></a>
                        </td>
                        <td v-text="ver.remark"></td>
                    </tr>
                </table>
            </div>
        </template>
    </WikiPanel>
</template>

<script>
import WikiPanel from "./WikiPanel";
import { wiki } from "@jx3box/jx3box-common/js/wiki";
import { getLink, authorLink, ts2str } from "@jx3box/jx3box-common/js/utils";
import jx3box from "@jx3box/jx3box-common/data/jx3box.json";
const { __Root, __OriginRoot } = jx3box;

export default {
    name: "WikiRevisions",
    props: {
        type: {
            type: String,
            default: "",
        },
        sourceId: {
            type: [String, Number],
            default: "",
        },
        isGame: {
            type: [Boolean, Number],
            default: false,
        },
    },
    data: function () {
        return {
            versions: [],
        };
    },
    computed: {
        client: function () {
            return location.href.includes("classic") || location.href.includes("origin") ? "origin" : "std";
        },
        baseUrl: function () {
            return this.client == "origin" ? __OriginRoot : __Root;
        },
        prefix: function () {
            if (this.isGame) {
                return this.baseUrl.slice(0, -1);
            } else {
                return "";
            }
        },
    },
    methods: {
        link: function (type, id) {
            return this.prefix + getLink(type, id);
        },
        author_url: function (uid) {
            return this.prefix + authorLink(uid);
        },
        ts2str,
        redirectRevision: function (ver, e) {
            if (!this.isGame && this.$router) {
                e.preventDefault();
                this.$router.replace({ path: `/view/${ver.source_id}/${ver.id}` });
            }
        },
    },
    components: {
        WikiPanel,
    },
    watch: {
        sourceId: {
            immediate: true,
            handler() {
                if (this.sourceId) {
                    wiki.versions({ type: this.type, id: this.sourceId }, { client: this.client }).then(
                        (res) => {
                            res = res.data;
                            this.versions = res.data || [];
                        },
                        () => {
                            this.versions = [];
                        }
                    );
                }
            },
        },
    },
};
</script>

<style lang="less">
/* src/wiki/WikiRevisions.vue */
@import "../../assets/css/wiki/wiki-revisions.less";
</style>

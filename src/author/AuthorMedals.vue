<template>
    <div class="c-author-medals" v-if="ready">
        <div class="u-label">
            <img svg-inline src="../../assets/img/leftsidebar/medal.svg" />
            <span>{{ $jx3boxT("jx3boxUi.authorMedals.title", "作者荣誉") }}</span>
        </div>
        <div class="u-medals" v-if="displayMedals.length">
            <el-tooltip
                class="item"
                effect="dark"
                :content="item.medal_desc"
                placement="top"
                v-for="item in displayMedals"
                :key="item.id"
            >
                <a :href="getMedalLink(item)" target="_blank" class="u-medal">
                    <img class="u-medal-img" :src="showIcon(item.medal)" />
                </a>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
import { getMedalLink } from "@jx3box/jx3box-common/js/utils";
import { getUserMedals } from "../../service/author";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
const { __cdn, __Root } = JX3BOX;

export default {
    name: "AuthorMedals",
    mixins: [i18nMixin],
    props: {
        uid: {
            type: [Number, String],
            default: 0,
        },
        medals: {
            type: Array,
        },
    },
    components: {},
    data: function () {
        return {
            legacyMedals: [],
            medalsRequestId: 0,
        };
    },
    computed: {
        displayMedals: function () {
            if (this.medals !== undefined) {
                return Array.isArray(this.medals) ? this.medals : [];
            }
            return this.legacyMedals;
        },
        legacyRequestKey: function () {
            return this.medals === undefined && this.uid ? String(this.uid) : "";
        },
        ready: function () {
            return this.displayMedals.length;
        },
    },
    watch: {
        legacyRequestKey: {
            immediate: true,
            handler: function (key) {
                this.loadLegacyMedals(key);
            },
        },
    },
    methods: {
        loadLegacyMedals: function (key) {
            const requestId = ++this.medalsRequestId;
            this.legacyMedals = [];
            if (!key) return;

            getUserMedals(this.uid, { is_wear: 1 })
                .then((data) => {
                    if (requestId !== this.medalsRequestId || key !== this.legacyRequestKey) return;
                    this.legacyMedals = Array.isArray(data) ? data : [];
                })
                .catch(() => {
                    if (requestId !== this.medalsRequestId || key !== this.legacyRequestKey) return;
                    this.legacyMedals = [];
                });
        },
        showIcon(medal) {
            return __cdn + "design/medals/user/" + medal + ".webp";
        },
        getMedalLink(medal) {
            if (medal.medal_url) return `${__Root}${medal.medal_url}`;
            return getMedalLink(medal.rank_id, medal.medal_type || "rank");
        },
    },
    created: function () {},
    mounted: function () {},
};
</script>

<style lang="less">
/* src/author/AuthorMedals.vue */
.c-author-medals {
    .u-medals {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 5px;
    }
    .u-medal {
        cursor: pointer;
        .u-medal-img {
            width: 20px;
            height: 20px;
        }
    }
}
</style>

<template>
    <a
        class="c-author-honor"
        :style="{ backgroundImage: `url(${imgUrl()})` }"
        v-if="displayHonor"
        :href="url"
        target="_blank"
    >
        <span :style="{ color: displayHonor.color }">{{ displayHonor.honor }}</span>
    </a>
</template>
<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { getUserHonor } from "../../service/cms";
import { inRange } from "lodash";

const { __cdn, __Root } = JX3BOX;
export default {
    props: {
        uid: {
            type: [Number, String],
            default: 0,
        },
        honor: {
            type: Object,
        },
    },
    data: function () {
        return {
            legacyHonor: null,
            honorRequestId: 0,
        };
    },
    computed: {
        displayHonor() {
            const honor = this.honor !== undefined ? this.honor : this.legacyHonor;
            return this.formatHonor(honor);
        },
        legacyRequestKey() {
            return this.honor === undefined && this.uid ? String(this.uid) : "";
        },
        url() {
            return this.displayHonor?.honor_info?.url ? __Root + this.displayHonor.honor_info.url : "";
        },
    },
    watch: {
        legacyRequestKey: {
            immediate: true,
            handler(key) {
                this.loadLegacyHonor(key);
            },
        },
    },
    methods: {
        imgUrl: function () {
            let item = this.displayHonor?.honor_info;
            if (!item) return;
            return __cdn + `design/decoration/honor/${item.img}/${item.img}.${item.img_ext || "png"}`;
        },
        loadLegacyHonor(key) {
            const requestId = ++this.honorRequestId;
            this.legacyHonor = null;
            if (!key) return;

            getUserHonor(this.uid)
                .then((res) => {
                    if (requestId !== this.honorRequestId || key !== this.legacyRequestKey) return;
                    this.legacyHonor = res?.data?.data || null;
                })
                .catch(() => {
                    if (requestId !== this.honorRequestId || key !== this.legacyRequestKey) return;
                    this.legacyHonor = null;
                });
        },
        formatHonor(honor) {
            if (!honor?.honor_info) return null;
            const data = { ...honor };
            let honorConfig = honor?.honor_info;
            let only = honorConfig.only;
            let prefix = honorConfig.prefix || "";
            let regPrefix = prefix.match(/\{([^{}]+?)\}/g);
            let ranking = honorConfig.ranking || [];
            let honorStr = honorConfig.year || "";

            if (!only) {
                if (regPrefix) {
                    honorStr = honorStr + (data[regPrefix[0].slice(1, -1)] || "");
                } else {
                    honorStr = honorStr + prefix;
                }
            } else {
                honorStr = prefix;
            }
            if (ranking.length > 0) {
                data.imgIndex = 0;
                for (let i = 0; i < ranking.length; i++) {
                    if (honor.ranking !== undefined && inRange(Number(honor.ranking), ranking[i][0], ranking[i][1])) {
                        data.imgIndex = i;
                        let str = ranking[i][2];
                        let regStr = str.match(/\{([^{}]+?)\}/g);
                        if (regStr) {
                            honorStr =
                                honorStr +
                                str.replace(/\{([^{}]+?)\}/g, function (match, p1) {
                                    return data[p1] || "";
                                });
                        } else {
                            honorStr = honorStr + str;
                        }
                        break;
                    }
                }
            }
            data.honor = honorStr + (honorConfig.suffix || "");
            data.color = honorConfig.color;
            data.img = honorConfig.img;
            data.img_ext = honorConfig.img_ext;
            data.isHave = true;
            data.isImgIndex = ranking?.length > 0;
            return data;
        },
    },
};
</script>
<style lang="less">
/* src/author/AuthorHonor.vue */
.c-author-honor {
    .dbi;
    text-align: center;
    .mb(10px);
    .size(220px,45px);
    color: #ffffff;
    .fz(10px,45px);
    .r(2px);
    background-size: 100% 100%;
}
</style>

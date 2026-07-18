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
import { inRange } from "lodash";

const { __cdn, __Root } = JX3BOX;
export default {
    props: {
        honor: {
            type: Object,
            default: null,
        },
    },
    computed: {
        displayHonor() {
            return this.formatHonor(this.honor);
        },
        url() {
            return this.displayHonor?.honor_info?.url ? __Root + this.displayHonor.honor_info.url : "";
        },
    },
    methods: {
        imgUrl: function () {
            let item = this.displayHonor?.honor_info;
            if (!item) return;
            return __cdn + `design/decoration/honor/${item.img}/${item.img}.${item.img_ext || "png"}`;
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

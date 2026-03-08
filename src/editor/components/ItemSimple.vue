<template>
    <el-popover
        v-if="item && !noPop"
        placement="right-end"
        popper-class="m-simple-item-popup"
        width="auto"
        :visible-arrow="false"
        trigger="hover"
        transition="none"
        :close-delay="0"
        v-model="visible"
        :effect="effect || 'light'"
        @show="item_id = item.id"
    >
        <template #reference>
            <div class="m-simple-item" @mousedown="visible = false" :class="{ onlyIcon: onlyIcon, withName: withName }">
                <div class="m-icon">
                    <div
                        class="u-border"
                        :style="{
                            backgroundImage: item_border(item),
                            opacity: item.Quality == 5 ? 0.9 : 1,
                        }"
                    ></div>
                    <div class="u-border-quest" :style="{ backgroundImage: item_border_quest(item) }"></div>
                    <img
                        class="u-icon"
                        :src="icon_url(item.IconID)"
                        :alt="`IconID:${item.IconID}`"
                        :style="{ width: iconSize, height: iconSize }"
                    />
                </div>
                <span class="u-name" :style="{ color: item_color(item.Quality) }" v-text="item.Name"></span>
                <span class="u-uiid fr" v-text="`ID: ${item.id}`"></span>
            </div>
        </template>
        <jx3-item :item_id="item_id" :jx3-client-type="jx3ClientType" />
    </el-popover>
    <div
        class="m-simple-item"
        v-if="item && noPop"
        @mousedown="visible = false"
        :class="{ onlyIcon: onlyIcon, withName: withName }"
    >
        <div class="m-icon">
            <div
                class="u-border"
                :style="{
                    backgroundImage: item_border(item),
                    opacity: item.Quality == 5 ? 0.9 : 1,
                }"
            ></div>
            <div class="u-border-quest" :style="{ backgroundImage: item_border_quest(item) }"></div>
            <img
                class="u-icon"
                :src="icon_url(item.IconID)"
                :alt="`IconID:${item.IconID}`"
                :style="{ width: iconSize, height: iconSize }"
            />
        </div>
        <span class="u-name" :style="{ color: item_color(item.Quality) }" v-text="item.Name"></span>
        <span class="u-uiid fr" v-text="`ID: ${item.id}`"></span>
    </div>
</template>

<script>
import Item from "./Item.vue";
import icon_url from "../../../assets/js/item/icon_url.js";
import item_color from "../../../assets/js/item/color.js";
import item_border from "../../../assets/js/item/border.js";
import item_border_quest from "../../../assets/js/item/border_quest.js";

export default {
    name: "ItemSimple",
    props: ["item", "onlyIcon", "iconSize", "withName", "jx3ClientType", "effect", "noPop"],
    data() {
        return { visible: false, item_id: null };
    },
    methods: {
        icon_url,
        item_color,
        item_border,
        item_border_quest,
    },
    components: {
        "jx3-item": Item,
    },
};
</script>

<style lang="less">
.m-simple-item-popup {
    min-width: initial;
    padding: 0;
    border: none;
    box-shadow: none;
    background-color: transparent;
    transform: translateY(-10px);
}

.m-simple-item {
    .u-border {
        background-repeat: no-repeat;
    }
    &.onlyIcon {
        .dbi;
        padding: 0;
        margin: 0;
        background-color: none;
        .u-name,
        .u-uiid {
            .none !important;
        }
        .m-icon {
            margin: 0 !important;
        }
    }
    &.withName {
        background: none;
        .w(90px);
        .x;
        .u-name {
            .db !important;
            color: #555;
            text-shadow: none;
            .mt(5px);
            .bold;
        }
    }
}
</style>
<style lang="less">
@import "../../../assets/css/module/item_simple.less";
</style>

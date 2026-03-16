<template>
    <aside
        class="c-sidebar-left c-sidebar m-theme"
        :class="{
            isclose: !isOpen,
            isopen: isOpen,
            'without-bread': withoutBread,
        }"
        v-if="!isApp"
        :style="{ backgroundImage: `url(${bg})` }"
    >
        <div class="c-sidebar-left-inner">
            <slot></slot>
        </div>
        <span
            class="c-sidebar-left-toggle"
            :class="!isOpen && 'close-sidebar-left'"
            @click="toggleLeftSide"
            :title="isOpen ? $jx3boxT('jx3boxUi.leftSidebar.collapse', '收起侧边栏') : $jx3boxT('jx3boxUi.leftSidebar.expand', '打开侧边栏')"
        >
            <el-icon>
                <ArrowRight v-if="!isOpen" />
                <ArrowLeft v-else />
            </el-icon>
        </span>
    </aside>
</template>

<script>
import Bus from "../utils/bus";
import { isApp } from "../assets/js/app.js";
import { getDecoration } from "../service/cms";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../i18n/mixin";
const DECORATION_SIDEBAR = "decoration_sidebar";
export default {
    name: "LeftSidebar",
    mixins: [i18nMixin],
    props: ["open", "withoutBread", "uid"],
    data: function () {
        return {
            isOpen: true,
            user_id: null,
            isApp: isApp(),
            bg: "",
        };
    },
    computed: {
        stickyHeader: function () {
            return this.withoutBread;
        },
    },
    watch: {
        open: function (newval) {
            this.isOpen = newval === undefined ? true : !!newval;
        },
        uid: function (newval) {
            this.user_id = newval;
            this.getDecoration();
        },
    },
    methods: {
        toggleLeftSide: function () {
            let status = !this.isOpen;
            Bus.emit("toggleLeftSide", status);
        },
        showDecoration: function (val, type) {
            return JX3BOX.__imgPath + `decoration/images/${val}/${type}.png`;
        },
        getDecoration() {
            if (!this.user_id) {
                return;
            }
            let decoration_sidebar = sessionStorage.getItem(DECORATION_SIDEBAR + this.user_id) || "";
            if (decoration_sidebar == "no") return;
            //已有缓存，读取解析
            try {
                let sidebar = JSON.parse(decoration_sidebar);
                this.bg = this.showDecoration(sidebar.val, "sidebar");
            } catch (err) {
                getDecoration({ using: 1, user_id: this.user_id, type: "sidebar" }).then((data) => {
                    let res = data.data.data || [];
                    if (res.length == 0) {
                        //空 则为无主题，不再加载接口，界面设No
                        sessionStorage.setItem(DECORATION_SIDEBAR + this.user_id, "no");
                        return;
                    }
                    let sidebar = res[0];
                    this.bg = this.showDecoration(sidebar.val, "sidebar");
                    sessionStorage.setItem(DECORATION_SIDEBAR + this.user_id, JSON.stringify(sidebar));
                });
            }
        },
    },
    beforeUnmount() {
        if (this.__toggleLeftSideHandler) {
            Bus.off("toggleLeftSide", this.__toggleLeftSideHandler);
            this.__toggleLeftSideHandler = null;
        }
        if (this.__docClickHandler) {
            document.removeEventListener("click", this.__docClickHandler);
            this.__docClickHandler = null;
        }
    },
    mounted: function () {
        this.__toggleLeftSideHandler = (data) => {
            this.isOpen = data;
        };
        Bus.on("toggleLeftSide", this.__toggleLeftSideHandler);

        if (window.innerWidth < 1024) {
            this.isOpen = false;

            this.__docClickHandler = () => {
                Bus.emit("toggleLeftSide", false);
            };
            document.addEventListener("click", this.__docClickHandler);
        }
    },
    created: function () {
        this.isOpen = this.open === undefined ? true : this.open;
        this.user_id = this.uid;
        this.getDecoration();
    },
};
</script>

<style lang="less">
/* src/LeftSidebar.vue */
@import "../assets/css/common/left-sidebar.less";
// 虚拟装扮主题
.m-theme {
    // background: url(../assets/testbg.png) no-repeat;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: top right;
}
</style>

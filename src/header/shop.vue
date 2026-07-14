<template>
    <div class="c-header-panel c-header-shop">
        <el-tooltip
            effect="dark"
            :content="$jx3boxT('jx3boxUi.commonHeader.mallPoints', '积分商城')"
            placement="bottom"
            popper-class="c-header-tooltip"
        >
            <a class="u-present" href="/vip/mall" @click="markPopRead">
                <i class="u-icon u-icon-msg">
                    <i class="u-pop" style="display: none" v-show="pop"></i>
                    <!-- <shopIcon class="u-icon" /> -->
                    <img
                        class="u-icon"
                        svg-inline
                        src="../../assets/img/common/gift.svg"
                        :alt="$jx3boxT('jx3boxUi.commonHeader.mallPoints', '积分商城')"
                    />
                </i>
            </a>
        </el-tooltip>
    </div>
</template>

<script>
import { getConfig } from "../../service/cms";
import i18nMixin from "../../i18n/mixin";
// import shopIcon from "@/assets/img/components/common/header/gift.svg";
export default {
    name: "shop",
    mixins: [i18nMixin],
    components: {
        // shopIcon,
    },
    data: function () {
        return {
            pop: false,
            initialized: false,
            popValue: "",
        };
    },
    props: {
        config: {
            type: Object,
            default: null,
        },
        configLoaded: {
            type: Boolean,
            default: true,
        },
        configManaged: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        configLoaded: function (val) {
            if (val) {
                this.init();
            }
        },
    },
    mounted() {
        if (this.configLoaded) {
            this.init();
        }
    },
    methods: {
        async init() {
            if (this.initialized) return;
            /**
             * 只在点击入口后记录本地版本；仅看到气泡不算已处理。
             */
            let config = this.config || (this.configManaged ? null : await getConfig({ key: "mall" }));
            if (!config) return;
            this.initialized = true;
            this.popValue = config.val;

            this.pop = this.shouldShowPop(config.val);
        },
        shouldShowPop(value) {
            if (!~~value) return false;

            const local = localStorage.getItem("mall_pop");
            return String(local) !== String(value);
        },
        markPopRead() {
            if (!this.pop || this.popValue == null) return;
            localStorage.setItem("mall_pop", this.popValue);
            this.pop = false;
        },
    },
};
</script>

<style lang="less">
/* src/header/shop.vue */
.c-header-shop {
    .u-present {
        padding: 0 10px;
        height: 100%;
        .flex;
        align-items: center;
        &:hover {
            .tm(0.7);
        }
    }

    .u-icon-msg {
        .pr;
        .size(18px);
    }

    .u-pop {
        width: 10px;
        height: 10px;
        color: #fff;
        background-image: linear-gradient(#fcd14f, #d7a20b);
        background-clip: padding-box;
        border: 2px solid @header-bg;
        border-radius: 50%;
        position: absolute;
        right: -5px;
        top: -4px;
        z-index: 1;
    }
}
</style>

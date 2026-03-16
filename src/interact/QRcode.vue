<template>
    <div ref="trigger" class="w-qrcode" v-bind="$attrs" @click="togglePic" v-if="mode == 'cms'">
        <img class="u-icon" svg-inline src="../../assets/img/widget/qr-code.svg" />
        <span class="u-text">二维码</span>
    </div>
    <teleport to="body">
        <div v-if="mode == 'cms' && active" class="u-qrcode u-qrcode-popup" :style="popupStyle" @click.stop>
            <qrcode-vue class="u-pic" :value="value" :size="size" level="H"></qrcode-vue>
            <span>扫一扫即可访问</span>
        </div>
    </teleport>
    <div class="w-qrcode-static" v-bind="$attrs" v-if="mode == 'static'">
        <div class="u-qrcode">
            <qrcode-vue class="u-pic" :value="value" :size="size" level="H"></qrcode-vue>
            <span class="u-txt"
                ><img class="u-icon" svg-inline src="../../assets/img/widget/qr-code.svg" />扫一扫手机访问</span
            >
        </div>
    </div>
</template>

<script>
import { nextTick } from "vue";
import QrcodeVue from "qrcode.vue";
export default {
    name: "QRcode",
    inheritAttrs: false,
    props: {
        href: {
            type: String,
            default: "",
        },
        v: {
            type: String,
            default: "cms",
        },
        s: {
            type: Number,
            default: 100,
        },
    },
    data: function () {
        return {
            value: this.href || location.href,
            size: this.s || 100,
            active: false,
            mode: this.v || "cms",
            popupStyle: {
                top: "0px",
                left: "0px",
            },
            docClickHandler: null,
            repositionHandler: null,
        };
    },
    computed: {},
    methods: {
        togglePic: function (e) {
            e.stopPropagation();
            this.active = !this.active;
            if (this.active) {
                nextTick(() => {
                    this.updatePopupPosition();
                });
            }
        },
        updatePopupPosition: function () {
            const trigger = this.$refs.trigger;
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            this.popupStyle = {
                top: `${rect.bottom + 5}px`,
                left: `${rect.left + rect.width / 2}px`,
            };
        },
    },
    mounted: function () {
        this.docClickHandler = () => {
            this.active = false;
        };
        this.repositionHandler = () => {
            if (this.active) {
                this.updatePopupPosition();
            }
        };

        document.addEventListener("click", this.docClickHandler);
        window.addEventListener("resize", this.repositionHandler);
        window.addEventListener("scroll", this.repositionHandler, true);
    },
    beforeUnmount: function () {
        document.removeEventListener("click", this.docClickHandler);
        window.removeEventListener("resize", this.repositionHandler);
        window.removeEventListener("scroll", this.repositionHandler, true);
    },
    components: {
        QrcodeVue,
    },
};
</script>

<style lang="less">
/* src/interact/QRcode.vue */
@import "../../assets/css/interact/qrcode.less";
</style>

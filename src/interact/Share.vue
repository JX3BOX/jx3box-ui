<template>
    <div class="w-share2">
        <el-popover trigger="hover" placement="right" popper-class="u-share2-pop" width="auto">
            <div class="u-share2-content">
                <div class="u-share2-content-main">
                    <div
                        v-for="shareItem in shareList"
                        class="u-share2-item"
                        :key="shareItem.key"
                        @click="share(shareItem.key)"
                        :title="$jx3boxT('jx3boxUi.share.share', '分享')"
                    >
                        <img class="u-share-icon" svg-inline :src="shareItem.img" :alt="shareItem.name">
                        <div class="u-share2-name">{{ shareItem.name }}</div>
                    </div>
                    <!-- <p class="tip">将文章链接贴</p> -->
                </div>
                <div class="u-share2-wechat">
                    <qrcode-vue
                        class="u-pic"
                        :value="url.href"
                        :size="75"
                        level="H"
                    ></qrcode-vue>
                    <span>{{ $jx3boxT("jx3boxUi.share.wechatShare", "微信扫一扫分享") }}</span>
                </div>
            </div>

            <template #reference>
                <!-- <el-tooltip class="item" effect="dark" content="分享" placement="top"> -->
                    <div v-if="simple">
                        <img class="u-icon u-simple-icon" svg-inline :src="iconPath" />
                        <!-- <i class="el-icon-position"></i> -->
                        <span class="u-text">{{ $jx3boxT("jx3boxUi.share.share", "分享") }}</span>
                    </div>
                    <img
                        v-else
                        class="u-icon"
                        svg-inline
                        :src="iconPath"
                    />
                <!-- </el-tooltip> -->
            </template>
        </el-popover>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import QrcodeVue from "qrcode.vue";
import i18nMixin from "../../i18n/mixin";

const { __imgPath } = JX3BOX;
export default {
    name: "ShareComp",
    mixins: [i18nMixin],
    props: {
        postType: {
            type: String,
            default: "",
        },
        postId: {
            type: [String, Number],
            default: "",
        },
        meta: {
            type: Object,
            default: () => ({}),
        },
        simple: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            apis: {
                qzone: 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',
                qq: 'http://connect.qq.com/widget/shareqq/index.html?',
                wechat: '',
                weibo: 'https://service.weibo.com/share/share.php?',
                tieba: 'http://tieba.baidu.com/f/commit/share/openShareApi?'
            },
            shareList: [
                {
                    name: this.$jx3boxT("jx3boxUi.share.weibo", "微博"),
                    key: 'weibo',
                    img: require('../../assets/img/widget/weibo.svg'),
                },
                {
                    name: this.$jx3boxT("jx3boxUi.share.qq", "QQ"),
                    key: 'qq',
                    img: require('../../assets/img/widget/qq.svg'),
                },
                {
                    name: this.$jx3boxT("jx3boxUi.share.qzone", "QQ空间"),
                    key: 'qzone',
                    img: require('../../assets/img/widget/qzone.svg'),
                },
                {
                    name: this.$jx3boxT("jx3boxUi.share.tieba", "贴吧"),
                    key: 'tieba',
                    img: require('../../assets/img/widget/tieba.svg'),
                },
                /* {
                    name: '微信',
                    key: 'wechat',
                    img: require('../../assets/img/widget/weixin.svg'),
                }, */
            ]
        };
    },
    computed: {
        ready() {
            return !!(this.postType && this.postId);
        },
        url() {
            return document.location;
        },
        title() {
            return this.meta?.title || document.title;
        },
        pic: function() {
            return this.meta?.banner ||  __imgPath + `image/common/logo.png`;
        },
        urls: function() {
            return  {
                qzone: this.shareToQzone,
                weibo: this.shareToWeibo,
                tieba: this.shareToTieba,
                qq: this.shareToQQ,
            }
        },
        iconPath() {
            return JX3BOX.__cdn + "design/vector/icon/share.svg"
        },
    },
    methods: {
        init: function () {
        },
        shareToWeibo: function (){
            return this.apis['weibo']
                + `url=${this.url}`
                + `&title=${this.title}`
                + `&pic=${this.pic}`;
        },
        shareToQzone: function (){
            return this.apis['qzone']
                + `url=${this.url}`
                + `&title=${this.title}`
                + '&sharesource=qzone'
                + `&summary=${this.meta?.summary || ''}`
                + `&desc=${this.meta?.desc || ''}`
                + `&pics=${this.pic}`;
        },
        shareToQQ: function (){
            return this.apis['qq']
                + `url=${this.url}`
                + `&title=${this.title}`
                + `&pics=${this.pic}`;
        },
        shareToTieba: function (){
            return this.apis['tieba']
                + `url=${this.url}`
                + `&title=${this.title}`
                + `&summary=${this.meta?.summary || ''}`
                + `&desc=${this.meta?.desc || ''}`
                + `&pic=${this.pic}`;
        },
        share: function (val){
            window.open(this.urls[val](), "_blank")
        }
    },
    mounted: function () {
        this.init();
    },
    components: {
        QrcodeVue
    }
};
</script>

<style lang="less">
@import "../../assets/css/interact/share2.less";
</style>

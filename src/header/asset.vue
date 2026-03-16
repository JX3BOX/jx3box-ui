<template>
    <div class="c-header-panel c-header-assets">
        <a class="u-asset" href="/dashboard/boxcoin">
            <img
                class="u-icon"
                svg-inline
                src="../../assets/img/common/coin.svg"
                :alt="$jx3boxT('jx3boxUi.commonHeader.asset', '资产')"
            />
        </a>

        <div class="u-assets u-pop-content">
            <div class="u-detail">
                <span class="u-item">
                    <a class="u-item-primary" href="/about/incentives" :target="target">
                        <span class="u-label"
                            ><el-icon><User /></el-icon> {{ $jx3boxT("jx3boxUi.commonHeader.level", "等级") }}</span
                        >
                        <span class="u-value u-level" :style="levelStyle">Lv.{{ level }}</span>
                    </a>
                    <!-- <span class="u-item-extend"><a href="/about/incentives" :target="target">[权益]</a></span> -->
                </span>
                <span class="u-item">
                    <a class="u-item-primary" href="/dashboard/boxcoin" :target="target"
                        ><span class="u-label"
                            ><el-icon><Coin /></el-icon> {{ $jx3boxT("jx3boxUi.commonHeader.boxCoin", "盒币") }}</span
                        >
                        <span class="u-value">{{ asset.box_coin }}</span></a
                    >
                    <span class="u-item-extend"
                        ><a href="/dashboard/boxcoin" :target="target"
                            >[{{ $jx3boxT("jx3boxUi.commonHeader.exchangeTongbao", "兑换通宝") }}]</a
                        ></span
                    >
                </span>
                <span class="u-item">
                    <a class="u-item-primary" href="/dashboard/points" :target="target"
                        ><span class="u-label"
                            ><el-icon><Sugar /></el-icon> {{ $jx3boxT("jx3boxUi.commonHeader.points", "积分") }}</span
                        >
                        <span class="u-value">{{ asset.points }}</span></a
                    >
                    <span class="u-item-extend"
                        ><a href="/vip/mall" :target="target">[{{ $jx3boxT("jx3boxUi.commonHeader.redeem", "兑礼") }}]</a
                        ><a href="/vip/lottery" :target="target"
                            >[{{ $jx3boxT("jx3boxUi.commonHeader.lottery", "抽奖") }}]</a
                        ></span
                    >
                </span>
                <span class="u-item">
                    <a class="u-item-primary" href="/dashboard/card" :target="target"
                        ><span class="u-label"
                            ><el-icon><CreditCard /></el-icon> {{ $jx3boxT("jx3boxUi.commonHeader.card", "卡密") }}</span
                        >
                        <span class="u-value">{{ asset.ext_info ? asset.ext_info.keycode : 0 }}</span></a
                    >
                    <span class="u-item-extend"
                        ><a href="/dashboard/card" :target="target">[{{ $jx3boxT("jx3boxUi.commonHeader.view", "查看") }}]</a></span
                    >
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
// import coinIcon from "@/assets/img/components/common/header/coin.svg";
export default {
    name: "Asset",
    mixins: [i18nMixin],
    components: {
        // coinIcon,
    },
    props: {
        asset: {
            type: Object,
            default: () => ({
                experience: 0,
                box_coin: 0,
                points: 0,
                ext_info: {
                    keycode: 0,
                },
            }),
        },
    },
    data() {
        return {
            // VIP
            target: "_self",
        };
    },
    computed: {
        level: function () {
            return User.getLevel(this.asset?.experience);
        },
        levelStyle: function () {
            return {
                background: JX3BOX.__userLevelColor[this.level],
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "2px",
            };
        },
    },
};
</script>

<style lang="less">
/* src/header/asset.vue */
@import '../../assets/css/mixin.less';


// 用户资产
.c-header-assets {
    position: relative;
    height: 100%;
    .u-asset {
        padding: 0 10px;
        height: 100%;
        .flex;
        align-items: center;
        &:hover {
            .tm(0.7);
        }
    }

    .u-assets {
        .u-delta;
        width: 160px;
        padding: 5px 0;
    }

    .u-detail {
        .u-item {
            .db;
            color: #454545;
            padding: 5px 15px;

            &:hover {
                background-color: @v4primary;
                .u-label {
                    color: #fff;
                }
                .u-value {
                    color: #fff;
                }
            }

            .u-item-primary {
                .flex;
                align-items: center;
                justify-content: space-between;
            }

            .u-label {
                color: @v4tip;
                .flex(y);
                gap:3px;
            }

            .u-value {
                font-weight: bold;
                .ml(5px);
                color: #111;
                .fz(13px);
            }
            .u-level {
                .fz(12px,14px);
            }
            .u-item-extend {
                .none;
                a {
                    .ml(5px);
                    &:hover {
                        color: @v4primary;
                    }
                }
            }
        }
    }
}
</style>

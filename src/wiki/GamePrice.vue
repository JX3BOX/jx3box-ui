<template>
    <span class="c-game-price" :class="{ 'is-align': align }">
        <span class="u-neg" v-if="numericPrice < 0">- </span>
        <span v-for="part in priceParts" :key="part.unit" :class="`u-${part.unit}`">
            <span class="u-value">{{ part.value }}</span>
            <img :src="part.icon" :alt="part.alt" />
        </span>
    </span>
</template>

<script>
import zhuanIcon from "../../assets/img/price/zhuan.png";
import jinIcon from "../../assets/img/price/jin.png";
import yinIcon from "../../assets/img/price/yin.png";
import tongIcon from "../../assets/img/price/tong.png";

const PRICE_UNITS = [
    { unit: "zhuan", base: 100000000, icon: zhuanIcon, alt: "砖" },
    { unit: "jin", base: 10000, icon: jinIcon, alt: "金" },
    { unit: "yin", base: 100, icon: yinIcon, alt: "银" },
    { unit: "tong", base: 1, icon: tongIcon, alt: "铜" },
];

export default {
    name: "GamePrice",
    props: {
        price: {
            type: [Number, String],
            default: 0,
        },
        align: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        numericPrice() {
            const value = Number(this.price);
            return Number.isFinite(value) ? Math.trunc(value) : 0;
        },
        priceParts() {
            const value = Math.abs(this.numericPrice);
            let remainder = value;

            const parts = PRICE_UNITS.map((item) => {
                const amount = Math.floor(remainder / item.base);
                remainder %= item.base;
                return {
                    ...item,
                    value: amount,
                };
            });

            const visibleParts = parts.filter((item) => item.value > 0);

            if (!visibleParts.length) {
                const tong = parts.find((item) => item.unit === "tong");
                return tong ? [{ ...tong, value: 0 }] : [];
            }

            return visibleParts;
        },
    },
};
</script>

<style lang="less">
/* src/wiki/GamePrice.vue */
.c-game-price {
    display: inline-flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;

    .u-neg,
    .u-zhuan,
    .u-jin,
    .u-yin,
    .u-tong {
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
    }

    img {
        display: inline-block;
        .y;
    }

    &.is-align {
        .u-jin {
            .u-value {
                display: inline-block;
                width: 4ch;
                text-align: right;
            }
        }
        .u-yin,
        .u-tong {
            .u-value {
                display: inline-block;
                width: 2ch;
                text-align: right;
            }
        }
    }
}
</style>

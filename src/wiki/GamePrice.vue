<template>
    <span class="c-game-price" :class="alignClass">
        <span class="u-neg" v-if="numericPrice < 0">- </span>
        <span class="u-price">
            <template v-for="part in priceParts" :key="part.unit">
                <span class="u-part" :class="`u-${part.unit}`">
                    <span class="u-price-value">{{ part.value }}</span>
                    <img :src="part.icon" :alt="part.alt" />
                </span>
            </template>
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
            type: [Boolean, String],
            default: false,
        },
    },
    computed: {
        numericPrice() {
            const value = Number(this.price);
            return Number.isFinite(value) ? Math.trunc(value) : 0;
        },
        alignClass() {
            if (this.align === true) return "is-align";
            if (typeof this.align === "string" && this.align) return `is-${this.align}`;
            return "";
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

            const zhuanIndex = parts.findIndex((item) => item.unit === "zhuan");
            const jinIndex = parts.findIndex((item) => item.unit === "jin");

            if (parts[zhuanIndex] && parts[zhuanIndex].value > 0) {
                return parts.slice(zhuanIndex);
            }

            return parts.slice(jinIndex);
        },
    },
};
</script>

<style lang="less">
.c-game-price {
    display: inline-flex;
    align-items: center;
    color: #333;
    font-weight: 500;

    .u-price {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
    }

    .u-neg {
        display: inline-flex;
        align-items: center;
    }

    .u-part {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        white-space: nowrap;
    }

    img {
        width: 18px;
        height: 18px;
        object-fit: contain;
        vertical-align: middle;
    }

    .u-price-value {
        .fz(12px,18px);
    }

    &.is-align {
        .u-jin {
            .u-price-value {
                display: inline-block;
                text-align: right;
            }
        }
        .u-yin,
        .u-tong {
            .u-price-value {
                display: inline-block;
                text-align: right;
            }
        }
    }

    &.is-right {
        justify-content: flex-end;
        width: 100%;
    }
}
</style>

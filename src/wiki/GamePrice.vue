<template>
    <span class="c-game-price" :class="rootClasses">
        <span class="u-neg" v-if="numericPrice < 0">- </span>
        <span class="u-price">
            <template v-for="part in priceParts" :key="part.unit">
                <span class="u-part" :class="`u-${part.unit}`">
                    <span class="u-price-value">{{ part.value }}</span>
                    <img :src="part.icon" :alt="$jx3boxT(`jx3boxUi.gamePrice.${part.unit}`, part.alt)" />
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
        variant: {
            type: String,
            default: "default",
            validator: (value) => ["default", "surface", "plain"].includes(value),
        },
        size: {
            type: String,
            default: "medium",
            validator: (value) => ["small", "medium", "large"].includes(value),
        },
        layout: {
            type: String,
            default: "inline",
            validator: (value) => ["inline", "block"].includes(value),
        },
        wrap: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        numericPrice() {
            const value = Number(this.price);
            return Number.isFinite(value) ? Math.trunc(value) : 0;
        },
        rootClasses() {
            const classes = [`is-${this.variant}`, `is-size-${this.size}`, `is-layout-${this.layout}`];
            if (this.align === true) classes.push("is-align");
            if (typeof this.align === "string" && this.align) classes.push(`is-${this.align}`);
            if (!this.wrap) classes.push("is-nowrap");
            if (this.numericPrice < 0) classes.push("is-negative");
            return classes;
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
    --jx3box-ui-game-price-color: #333;
    --jx3box-ui-game-price-icon-size: 18px;
    --jx3box-ui-game-price-font-size: 12px;
    --jx3box-ui-game-price-gap: 6px;
    --jx3box-ui-game-price-negative-color: var(--jx3box-ui-game-price-color);

    display: inline-flex;
    align-items: center;
    color: var(--jx3box-ui-game-price-color);
    font-weight: 500;

    .u-price {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--jx3box-ui-game-price-gap);
    }

    .u-neg {
        display: inline-flex;
        align-items: center;
        color: var(--jx3box-ui-game-price-negative-color);
    }

    .u-part {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        white-space: nowrap;
    }

    img {
        width: var(--jx3box-ui-game-price-icon-size);
        height: var(--jx3box-ui-game-price-icon-size);
        object-fit: contain;
        vertical-align: middle;
    }

    .u-price-value {
        font-size: var(--jx3box-ui-game-price-font-size);
        line-height: var(--jx3box-ui-game-price-icon-size);
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

    &.is-size-small {
        --jx3box-ui-game-price-icon-size: 14px;
        --jx3box-ui-game-price-font-size: 11px;
        --jx3box-ui-game-price-gap: 4px;
    }

    &.is-size-large {
        --jx3box-ui-game-price-icon-size: 22px;
        --jx3box-ui-game-price-font-size: 14px;
        --jx3box-ui-game-price-gap: 8px;
    }

    &.is-layout-block {
        display: flex;
        width: 100%;
    }

    &.is-nowrap {
        .u-price {
            flex-wrap: nowrap;
        }
    }

    &.is-surface {
        --jx3box-ui-game-price-color: #334155;
    }
}
</style>

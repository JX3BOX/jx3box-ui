<template>
    <div class="c-equip" v-if="plan">
        <div
            class="u-equip"
            :class="'u-equip-' + label"
            v-for="(item, label) in equip"
            :key="label"
        >
            <jx3-item-simple
                :item="item"
                :onlyIcon="true"
                iconSize="56px"
                :withName="true"
            />
        </div>
        <div class="u-info">
            <div class="u-title">{{ plan.title }}</div>
            <a class="u-author" :href="userpage" target="_blank">
                <img :src="avatar" class="u-author-avatar" />
                <span class="u-author-name">{{ plan.user_nickname }}</span>
            </a>
            <div class="u-time">
                <i class="el-icon-date"></i>
                {{ showTime((plan.updated * 1000)) }}
            </div>
            <div class="u-desc">{{ plan.description }}</div>
            <div class="u-qrcodebox">
                <QRcode :href="link" :s="120" v="static" />
            </div>
        </div>
        <div class="u-misc">
            <a class="u-logo" :href="link" target="_blank">
                <img svg-inline src="../../../assets/img/editor/jx3box.svg" />
                <span>配装ID:{{ plan.id }}</span>
            </a>
        </div>
    </div>
</template>

<script>
import EquipPosition from "../../../service/enum/EquipPosition";
import ItemSimple from "./ItemSimple.vue";
import * as utilModule from "@jx3box/jx3box-common/js/utils.js";
const { authorLink } = utilModule;
import QRcode from "@jx3box/jx3box-common-ui/src/interact/QRcode.vue";
import { showTime } from "@jx3box/jx3box-common/js/moment.js";
import { get_plan } from "../../../service/item.js";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __Root } = JX3BOX;
export default {
    name: "EquipComponent",
    props: ["data", "id"],
    data: function() {
        return {
            plan_data: "",
        };
    },
    computed: {
        plan: function() {
            return this.id ? this.plan_data : this.data;
        },
        equip: function() {
            return {
                weapon_1: this.plan.relation_items[
                    EquipPosition.MELEE_WEAPON
                ][0],
                weapon_2: this.plan.relation_items[
                    EquipPosition.RANGE_WEAPON
                ][0],
                cap: this.plan.relation_items[EquipPosition.HELM][0],
                cloth: this.plan.relation_items[EquipPosition.CHEST][0],
                belt: this.plan.relation_items[EquipPosition.WAIST][0],
                wrist: this.plan.relation_items[EquipPosition.BANGLE][0],
                trousers: this.plan.relation_items[EquipPosition.PANTS][0],
                shoes: this.plan.relation_items[EquipPosition.BOOTS][0],
                necklace: this.plan.relation_items[EquipPosition.AMULET][0],
                pendant: this.plan.relation_items[EquipPosition.PENDANT][0],
                ring_1: this.plan.relation_items[EquipPosition.RING_1][0],
                ring_2: this.plan.relation_items[EquipPosition.RING_2][0],
            };
        },
        avatar: function() {
            return this.plan ? this.plan.user_avatar : "";
        },
        username: function() {
            return this.plan ? this.plan.user_nickname : "";
        },
        uid: function() {
            return this.plan ? this.plan.user_id : "";
        },
        userpage: function() {
            return this.uid ? authorLink(this.uid) : "";
        },
        link: function() {
            return this.plan ? __Root + `item/#/plan_view/${this.plan.id}` : "";
        },
    },
    methods: {
        showTime,
    },
    mounted: function() {
        if (this.id) {
            get_plan(this.id).then((res) => {
                this.plan_data = res.data.data.plan;
            });
        }
    },
    components: {
        "jx3-item-simple": ItemSimple,
        QRcode,
    },
};
</script>

<style lang="less">
.c-equip {
    .dbi;
    .size(500px, 750px);
    background-color: @bg-black;
    border: 6px solid #444;
    .r(6px);

    .u-info {
        .mt(20px);
        .w(280px);
        .auto(x);
        .x;
    }
    .u-title {
        .nobreak;
        .fz(1rem, 2);
        .bold;
        color: #fff;
    }

    .u-author {
        // .pa;.lt(50%);
        // transform: translate3d(-50%,-50%,0);
        img {
            .r(2px);
            .size(20px);
            .y;
        }
        img {
            .mr(5px);
        }
        span {
            .fz(13px, 2.5);
            color: #ccc;
        }
    }

    .u-desc {
        .mt(10px);
        color: #ccc;
        font-size: 13px;
        line-height: 1.8;
        .break(10);
        .h(240px);
        white-space: pre-wrap;
        text-align: left;
        background: #2b2e31;
        padding: 10px;
        box-sizing: border-box;
    }

    .u-time {
        // .x(right);
        color: #999;
        .fz(12px);
        // .mt(5px);
    }

    .u-qrcodebox {
        .mt(60px);
        .w(140px);
        .auto(x);

        .w-qrcode-static {
            .u-txt {
                .mt(10px);
                color: #999;
                .fz(12px, 16px);
            }
            svg {
                fill: #999;
                .size(16px);
                .y(-4px);
            }
            .u-pic {
                padding: 10px 8px 8px 8px;
                border-radius: 2px;
            }
        }
    }

    .pr;
    .u-equip {
        .pa;
        .u-name {
            .none;
        }
        .u-uiid {
            .none;
        }
    }

    .u-equip-weapon_1 {
        .lt(170px, 630px);
    }
    .u-equip-weapon_2 {
        .lt(240px, 630px);
    }

    .u-equip-cap {
        .lt(12px, 90px);
    }

    .u-equip-cloth {
        .lt(12px, 270px);
    }

    .u-equip-belt {
        .lt(12px, 450px);
    }

    .u-equip-wrist {
        .lt(400px, 90px);
    }

    .u-equip-trousers {
        .lt(400px, 180px);
    }

    .u-equip-shoes {
        .lt(400px, 270px);
    }

    .u-equip-necklace {
        .lt(400px, 360px);
    }

    .u-equip-pendant {
        .lt(400px, 450px);
    }

    .u-equip-ring_1 {
        .lt(400px, 540px);
    }

    .u-equip-ring_2 {
        .lt(400px, 630px);
    }

    .u-misc {
        .pa;
        .lt(30px, 630px);
    }

    .u-logo {
        .db;
        svg,
        span {
            transition: 0.2s ease-in-out;
        }
        svg {
            .size(56px);
            fill: #fff;
        }
        span {
            .db;
            color: #fff;
            font-family: Consolas;
            .fz(12px);
            // .bold;
        }
        &:hover {
            span {
                color: #0cf;
            }
            svg {
                fill: #0cf;
            }
        }
    }

    .u-meta {
        // .mt(5px);
        .fz(12px);
        .db;
        // color:#1bbfe0;
        color: #fff;
        // &:hover{
        //     color:#ff0;
        // }
        // .pa;.lb(20px,20px);
    }
}
</style>

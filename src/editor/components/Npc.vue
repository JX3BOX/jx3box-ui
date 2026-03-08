<template>
    <div class="w-npc" v-if="data">
        <div class="w-npc-wrapper">
            <div class="w-npc-content">
                <div class="u-npc">
                    <div class="u-title">
                        <span class="u-name">{{ data.Name }}</span>
                        <span class="u-name-add">
                            <span v-if="data.Title || data.Level">&lt;</span>
                            <span class="u-nick" v-if="data.Title">
                                {{ data.Title }}
                            </span>
                            <span v-if="data.Title && data.Level">·</span>
                            <b class="u-level" v-if="data.Level">{{ data.Level }}</b>
                            <span v-if="data.Title || data.Level">&gt;</span>
                        </span>
                        <div class="u-base">
                            <span class="u-atmap" v-if="data.MapName">
                                {{ data.MapName }}
                            </span>
                            <span class="u-intensity" v-if="data.Intensity">
                                强度
                                {{ data.Intensity }}
                            </span>
                        </div>
                    </div>
                    <div class="u-primary">
                        <div class="u-life">
                            <img class="u-descicon u-descicon-life" svg-inline src="../../../assets/img/npc/energy.svg" />
                            <b>血量</b>
                            <em>MaxLife</em>
                            <strong>{{ data.MaxLife }}</strong>
                        </div>
                        <div class="u-mana">
                            <img class="u-descicon u-descicon-mana" svg-inline src="../../../assets/img/npc/energy.svg" />
                            <b>内力</b>
                            <em>MaxMana</em>
                            <strong>{{ data.MaxMana }}</strong>
                        </div>
                        <div class="u-touch" v-if="data.TouchRange">
                            <img class="u-descicon u-descicon-touch" svg-inline src="../../../assets/img/npc/radar.svg" />
                            <b>范围</b>
                            <em>TouchRange</em>
                            <strong>{{ data.TouchRange }}</strong>
                        </div>
                        <div class="u-sense" v-if="data.Sense">
                            <img class="u-descicon u-descicon-sense" svg-inline src="../../../assets/img/npc/sight.svg" />
                            <b>识破</b>
                            <em>Sense</em>
                            <strong>{{ data.Sense }}</strong>
                        </div>
                        <div class="u-dodge" v-if="data.Dodge">
                            <img class="u-descicon u-descicon-dodge" svg-inline src="../../../assets/img/npc/miss.svg" />
                            <b>闪避</b>
                            <em>Dodge</em>
                            <strong>{{ data.Dodge }}</strong>
                        </div>
                        <div class="u-dodge" v-if="data.Parry">
                            <img class="u-descicon u-descicon-dodge" svg-inline src="../../../assets/img/npc/miss.svg" />
                            <b>招架</b>
                            <em>Parry</em>
                            <strong>{{ data.ParryValue }}</strong>
                        </div>
                        <div class="u-shield">
                            <img class="u-descicon u-descicon-shield" svg-inline src="../../../assets/img/npc/shield.svg" />
                            <b>防御</b>
                            <em>Shield</em>
                            <span class="u-sitem">
                                外功防御
                                <em>PhysicsShieldBase</em>
                                <span class="u-value">{{ ~~data.PhysicsShieldBase }}</span>
                            </span>
                            <span class="u-sitem">
                                混元防御
                                <em>NeutralMagicDefence</em>
                                <span class="u-value">{{ ~~data.NeutralMagicDefence }}</span>
                            </span>
                            <span class="u-sitem">
                                阳性防御
                                <em>SolarMagicDefence</em>
                                <span class="u-value">{{ ~~data.SolarMagicDefence }}</span>
                            </span>
                            <span class="u-sitem">
                                阴性防御
                                <em>LunarMagicDefence</em>
                                <span class="u-value">{{ ~~data.LunarMagicDefence }}</span>
                            </span>
                            <span class="u-sitem">
                                毒性防御
                                <em>PoisonMagicDefence</em>
                                <span class="u-value">{{ ~~data.PoisonMagicDefence }}</span>
                            </span>
                        </div>
                        <div class="u-critical">
                            <img class="u-descicon u-descicon-attack" svg-inline src="../../../assets/img/npc/attack.svg" />
                            <b>会心</b>
                            <em>Critical</em>
                            <span class="u-sitem">
                                外功会心
                                <em>PhysicsCriticalStrike</em>
                                <span class="u-value">{{ ~~data.PhysicsCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                混元会心
                                <em>NeutralCriticalStrike</em>
                                <span class="u-value">{{ ~~data.NeutralCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                阳性会心
                                <em>SolarCriticalStrike</em>
                                <span class="u-value">{{ ~~data.SolarCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                阴性会心
                                <em>LunarCriticalStrike</em>
                                <span class="u-value">{{ ~~data.LunarCriticalStrike }}</span>
                            </span>
                            <span class="u-sitem">
                                毒性会心
                                <em>PoisonCriticalStrike</em>
                                <span class="u-value">{{ ~~data.PoisonCriticalStrike }}</span>
                            </span>
                        </div>
                        <div class="u-attack">
                            <img class="u-descicon u-descicon-attack" svg-inline src="../../../assets/img/npc/target.svg" />
                            <b>命中</b>
                            <em>Attack</em>
                            <span class="u-sitem">
                                外功命中
                                <em>PhysicsAttackHit</em>
                                <span class="u-value">{{ ~~data.PhysicsAttackHit }}</span>
                            </span>
                            <span class="u-sitem">
                                混元命中
                                <em>NeutralMagicHit</em>
                                <span class="u-value">{{ ~~data.NeutralMagicHit }}</span>
                            </span>
                            <span class="u-sitem">
                                阳性命中
                                <em>SolarMagicHit</em>
                                <span class="u-value">{{ ~~data.SolarMagicHit }}</span>
                            </span>
                            <span class="u-sitem">
                                阴性命中
                                <em>LunarMagicHit</em>
                                <span class="u-value">{{ ~~data.LunarMagicHit }}</span>
                            </span>
                            <span class="u-sitem">
                                毒性命中
                                <em>PoisonMagicHit</em>
                                <span class="u-value">{{ ~~data.PoisonMagicHit }}</span>
                            </span>
                        </div>
                    </div>
                    <div class="u-id">
                        ID : {{id}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getNpc } from "../../../service/database.js";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { iconLink } = utilModule;
export default {
    name: "NpcComponent",
    props: ["client", "id"],
    data: () => ({
        data: null,
    }),
    computed: {
        params: function() {
            return [this.client, this.id];
        },
    },
    watch: {
        params: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val) {
                    let [client, id] = val;
                    // 读取本地数据
                    const cache = sessionStorage.getItem(`npc-${client}-${id}`);
                    if (cache) {
                        this.data = JSON.parse(cache);
                        // 没有缓存则发起请求获取数据
                    } else {
                        id &&
                            getNpc(...this.params).then((res) => {
                                let data = res.data?.list?.[0];
                                this.data = data;

                                // 将数据放入 sessionStorage
                                sessionStorage.setItem(`npc-${client}-${id}`, JSON.stringify(data));
                            });
                    }
                }
            },
        },
    },
    methods: {
        iconLink: function(id) {
            return iconLink(id, this.client);
        },
    },
};
</script>

<style lang="less">
@import "../../../assets/css/module/npc.less";
</style>

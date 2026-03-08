<template>
    <div class="w-skill" v-if="data">
        <div class="w-skill-wrapper">
            <img class="w-skill-icon" :src="iconLink(data.IconID || 13)" :alt="data.Name" />
            <div class="w-skill-content">
                <span class="w-skill-name">{{data.Name}}</span>
                <span class="w-skill-desc">{{data.Desc}}</span>
                <span class="w-skill-meta">ID : {{data.SkillID}}</span>
                <span class="w-skill-meta">Level : {{data.Level}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { getSkill } from "../../../service/database.js";
import * as utilModule from "@jx3box/jx3box-common/js/utils";
const { iconLink } = utilModule;
export default {
    name: "SkillComponent",
    props: ["client", "id", "level"],
    data: () => ({
        data: null,
    }),
    computed: {
        params: function () {
            return [this.client, this.id, this.level];
        },
    },
    watch: {
        params: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val) {
                    let [client, id, level] = val;
                    // 读取本地数据
                    const cache = sessionStorage.getItem(
                        `skill-${client}-${id}-${level}`
                    );
                    if (cache) {
                        this.data = JSON.parse(cache);
                        // 没有缓存则发起请求获取数据
                    } else {
                        id &&
                            getSkill(...this.params).then((res) => {
                                let data = res.data?.list?.[0];
                                this.data = data;

                                // 将数据放入 sessionStorage
                                sessionStorage.setItem(
                                    `skill-${client}-${id}-${level}`,
                                    JSON.stringify(data)
                                );
                            });
                    }
                }
            },
        },
    },
    methods : {
        iconLink : function (id){
            return iconLink(id,this.client)
        }
    }
};
</script>

<style lang="less">
@import "../../../assets/css/module/skill.less";
</style>

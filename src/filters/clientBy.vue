<template>
    <div class="w-filter-client">
        <ul>
            <li class="u-client" :class="{on: client == ''}" @click="filter('')" v-if="clients">
                {{ $jx3boxT("jx3boxUi.clientBy.all", "全部") }}
            </li>
            <li
                class="u-client"
                :class="{ on: client == value }"
                v-for="(label, value) in computedClients"
                :key="value"
                @click="filter(value)"
            >
                {{ label }}
            </li>
        </ul>
    </div>
</template>

<script>
import i18nMixin from "../../i18n/mixin";
export default {
    name: "clientBy",
    mixins: [i18nMixin],
    emits: ["filter"],
    props: {
        type: {
            type: String,
            default: "",
        },
        clients: {
            type: Object,
            default: () => null,
        },
        showWujie: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            client: this.type || "",
        };
    },
    computed: {
        computedClients: function () {
            const clients = {
                all: this.$jx3boxT("jx3boxUi.clientBy.allClients", "全端"),
                std: this.$jx3boxT("jx3boxUi.clientBy.std", "剑三"),
                origin: this.$jx3boxT("jx3boxUi.clientBy.origin", "缘起"),
            };
            if (this.showWujie) {
                return Object.assign({}, this.clients || clients, {
                    wujie: this.$jx3boxT("jx3boxUi.clientBy.wujie", "无界"),
                });
            }
            return this.clients || clients;
        },
    },
    methods: {
        filter: function (val) {
            this.client = val;
            this.$emit("filter", { type: "client", val: val });
            this.$forceUpdate();
        },
    },
    mounted: function () {
        const client = location.href.includes("origin") ? "origin" : "std";
        if (client) {
            this.client = client;
            this.filter(this.client);
        }
    },
};
</script>

<style lang="less">
/* src/filters/clientBy.vue */
.w-filter-client {
    font-size: 0;
    ul,
    li {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    ul {
        .clearfix;
        .dbi;
        background-color: @bg-gray;
        border: 1px solid #eee;
        .r(3px);
        overflow: hidden;
    }
    li {
        padding: 5px 10px;
        .fl;
        .fz(12px);
        border-right: 1px solid #eee;
        &:last-child {
            border-right: none;
        }
        .pointer;

        &.on {
            background-color: var(--el-color-primary);
            color: #fff;
            border-color: var(--el-color-primary);
        }
    }
}
</style>

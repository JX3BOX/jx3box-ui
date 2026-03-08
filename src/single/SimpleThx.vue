<template>
    <div class="w-thx">
        <div class="w-thx-panel">
            <boxcoin-admin
                :postId="postId"
                :postType="postType"
                v-if="hasRight && adminBoxcoinEnable && boxcoin_enable"
                :userId="userId"
                :max="admin_max"
                :min="admin_min"
                :own="admin_left"
                :total="admin_total"
                :points="admin_points"
                :authors="authors"
                @updateRecord="updateRecord"
                :client="client"
            />
            <Like :postId="postId" :postType="postType"></Like>
            <fav :postId="postId" :postType="postType" :postTitle="postTitle"></fav>
            <boxcoin-user
                :postId="postId"
                :postType="postType"
                :boxcoin="boxcoin"
                :userId="userId"
                :own="user_left"
                :points="user_points"
                :authors="authors"
                v-if="userBoxcoinEnable && boxcoin_enable && allowGift"
                @updateRecord="updateRecord"
                :client="client"
            />
            <el-tooltip effect="dark" content="打赏记录" placement="top-start">
                <!-- <div class="w-boxcoin-block"> -->
                <img
                    src="../../assets/img/widget/records.svg"
                    svg-inline
                    class="u-record-icon"
                    alt=""
                    @click="onRecord"
                />
                <!-- </div> -->
            </el-tooltip>
        </div>

        <el-drawer v-model="showDrawer" title="打赏记录" append-to-body>
            <BoxcoinRecords
                :postId="postId"
                :postType="postType"
                :postClient="client"
                :cacheRecord="cacheRecord"
                :mode="mode"
                @update:boxcoin="updateBoxcoin"
            />
        </el-drawer>
    </div>
</template>

<script>
import Like from "../interact/Like.vue";
import Fav from "../interact/Fav.vue";
import BoxcoinAdmin from "../interact/BoxcoinAdmin.vue";
import BoxcoinUser from "../interact/BoxcoinUser.vue";
import BoxcoinRecords from "../interact/BoxcoinRecords.vue";
import User from "@jx3box/jx3box-common/js/user";
import { getBoxcoinStatus, getPostBoxcoinConfig } from "../../service/thx";

export default {
    name: "SimpleThx",
    components: {
        Like,
        Fav,
        BoxcoinAdmin,
        BoxcoinUser,
        BoxcoinRecords,
    },
    props: {
        type: {
            type: String,
            default: "normal",
        },
        postId: {
            type: Number,
            default: 0,
        },
        postType: {
            type: String,
            default: "",
        },
        postTitle: {
            type: String,
            default: "",
        },
        userId: {
            type: Number,
            default: 0,
        },
        authors: {
            type: Array,
            default: () => [],
        },
        mode: {
            type: String,
            default: "normal",
        },
        client: {
            type: String,
            default: "std",
        },
        allowGift: {
            type: [Number, Boolean],
            default: 1,
        },
        adminBoxcoinEnable: {
            type: Boolean,
            default: false,
        },
        userBoxcoinEnable: {
            type: Boolean,
            default: false,
        },
        presetConfig: {
            type: Object,
            default: () => ({}),
        },
    },
    data: function () {
        return {
            boxcoin: 0,
            hasRight: User.getInfo().group >= 32,
            user: User.getInfo(),

            admin_max: 0,
            admin_min: 0,
            admin_left: 0,
            admin_total: 0,
            admin_points: [100],

            user_left: 0,
            user_points: [100],

            cacheRecord: null,
            boxcoin_enable: 0,

            showDrawer: false,
        };
    },
    computed: {
        post_keys: function () {
            return [this.postId, this.postType];
        },
    },
    watch: {
        post_keys: {
            immediate: true,
            deep: true,
            handler: function () {
                this.postType && this.postId && this.loadBoxcoinConfig();
            },
        },
    },
    methods: {
        loadBoxcoinConfig: function () {
            if (Object.keys(this.presetConfig)?.length) {
                this.admin_max = this.presetConfig.admin_max || 0;
                this.admin_min = this.presetConfig.admin_min || 0;
                this.admin_points = this.presetConfig.admin_points || [10, 1000];
                this.admin_left = this.presetConfig.admin_left || 0;
                this.admin_total = this.presetConfig.admin_total || 0;

                this.user_points = this.presetConfig.user_points || [10, 1000];
                this.user_left = this.presetConfig.user_left || 0;
                this.boxcoin_enable = this.presetConfig.boxcoin_enable || 0;
                return;
            }
            User.isLogin() &&
                getPostBoxcoinConfig(this.postType).then((res) => {
                    this.admin_max = res.data.data.limit.admin_max || 0;
                    this.admin_min = res.data.data.limit.admin_min || 0;
                    this.admin_points = res.data.data.limit.admin_points || [10, 1000];
                    this.admin_left = res.data.data.asManagerBoxCoinRemain || 0;
                    this.admin_total = res.data.data.asManagerBoxCoinTotal || 0;

                    this.user_points = res.data.data.limit.user_points || [10, 1000];
                    // 根据多端展示剩余币
                    // 作品是n端，接受n端币+all币
                    if (this.client == "origin") {
                        this.user_left = res.data.data.asUserBoxCoinRemainOrigin + res.data.data.asUserBoxCoinRemainAll;
                    } else if (this.client == "std") {
                        this.user_left = res.data.data.asUserBoxCoinRemainStd + res.data.data.asUserBoxCoinRemainAll;
                    } else {
                        this.user_left =
                            res.data.data.asUserBoxCoinRemainAll +
                            res.data.data.asUserBoxCoinRemainStd +
                            res.data.data.asUserBoxCoinRemainOrigin;
                    }
                });
            getBoxcoinStatus().then((res) => {
                this.boxcoin_enable = !!~~res.data?.data?.val;
            });
        },
        // 用户打赏
        updateRecord: function (data) {
            this.cacheRecord = data;
        },
        onRecord: function () {
            this.showDrawer = true;
        },
        updateBoxcoin: function (data) {
            this.boxcoin = data;
        },
    },
};
</script>

<style lang="less">
@import "../../assets/css/single/thx.less";
</style>

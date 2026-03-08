<template>
    <div class="c-header-search" id="c-header-search">
        <div class="c-search">
            <form class="u-form" @submit.prevent="handleSubmit">
                <input class="u-text" type="text" autocomplete="off" name="q" placeholder="搜索.." ref="searchInput" />
                <input type="hidden" name="client" :value="client" />
                <i class="u-btn" @click="handleSubmit">
                    <!-- <search-icon /> -->
                    <img svg-inline src="../../assets/img/common/search-key-slash.svg" alt="搜索">
                </i>
            </form>
        </div>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { searchJump } from "./utils";
// import searchIcon from "@/assets/img/components/common/header/search-key-slash.svg";
export default {
    name: "search",
    components: {
        // searchIcon,
    },
    data: function () {
        return {
            isPhone: window.innerWidth < 720 ? true : false,
            url: JX3BOX.__Root + "search",
            client: location.href.includes("origin") ? "origin" : "std",
        };
    },
    computed: {},
    methods: {
        handleSubmit() {
            // 获取输入框的值
            const searchValue = this.$refs.searchInput.value;
            if (!searchValue) return;

            searchJump({
                searchValue: searchValue,
                isPhone: this.isPhone,
                url: this.url,
                client: this.client,
            });
        },
    },
    created: function () {},
};
</script>

<style lang="less">
//搜索
.c-header-search {
    width: 220px;
    // padding: 16px 0;
    margin: ((@header-height - @header-logo-size - 2px)/2) 0;

    .u-form {
        position: relative;
    }

    .u-text {
        background-color: #3a4248;
        border: 2px solid @bg-black;
        // background-color:#636872;
        // border: 0;
        box-shadow: none;
        color: #fff;
        height: @header-logo-size + 2px;
        line-height: @header-logo-size + 2px;
        box-sizing: border-box;
        border-radius: 10px;
        font-size: 14px;
        padding: 0.625em 0.4375em;
        width: 100%;

        &:focus {
            background-color: #fff;
            color: #1a1a1a;
            outline: 0;
        }
        transition: background-color 0.1s ease-in;

        &::placeholder {
            font-size: 11px;
            color: #999;
            padding-left: 5px;
        }
    }

    .u-btn {
        border: 0;
        position: absolute;
        right: 10px;
        top: 7px;
        display: block;
        width: 19px;
        height: 20px;
        padding: 0;
    }
}
@media screen and (max-width: @phone) {
    .c-header-search {
        .none;
    }
}
</style>

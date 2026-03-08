<template>
    <div class="c-header-logo" @click="toggleBox($event)" title="点击展开魔盒矩阵">
        <i class="u-pic" id="c-header-logo">
            <img svg-inline src="../../assets/img/common/logo.svg" alt="JX3BOX" />
        </i>
        <span class="u-txt" :class="{ on: isIndex }" href="/">魔盒</span>
    </div>
</template>

<script>
// import { useLayoutStore } from "@/store/layout";

export default {
    name: "c-header-logo",
    components: {
        // Logo,
    },
    props: [],
    data: function () {
        return {
            isIndex: /\/index\/?/.test(location.pathname),
        };
    },
    computed: {},
    methods: {
        // TODO: 主页和魔盒矩阵的切换
        // 盒子
        // toggleBox: function (e) {
        //     e.stopPropagation();
        //     const layout = useLayoutStore();
        //     layout.toggleBoxMatrix();
        // },
    },
    mounted: function () {},
};
</script>

<style lang="less">
//logo
.c-header-logo {
    .pointer;
    user-select: none;
    display: inline-flex;
    flex-shrink: 0;
    flex-grow: 0;
    align-items: center;
    height: @header-height;
    padding: 0 0 0 10px;

    @padding: ((@header-height - @header-logo-size) / 2);

    .u-pic {
        .db;
        width: @header-logo-size;
        height: @header-logo-size;
        float: left;
        svg {
            .size(100%);
            fill: #fff;
        }
        transition: 0.3s ease-in-out;
    }
    .u-txt {
        .db;
        color: #fff;
        font-size: 20px;
        font-weight: 600;
        line-height: @header-logo-size;
        margin-left: 10px;
        transition: 0.15s ease-in-out;
    }

    &:hover .u-pic {
        transform: scale(1.1);
    }
}
@media screen and (max-width: @phone) {
    .c-header-logo {
        padding-right: 0;
        .u-pic {
            margin: 0;
        }
        .u-txt {
            display: none;
        }
        margin-right: 0;
    }
}
</style>

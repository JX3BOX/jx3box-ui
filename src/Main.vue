<template>
    <main
        class="c-main"
        :class="[
            withoutRight ? 'without-right' : expandingRight ? 'expanding-right' : '',
            { 'without-left': expanding },
            { 'without-bread': withoutBread },
        ]"
    >
        <slot></slot>
    </main>
</template>

<script>
import Bus from "../utils/bus";
export default {
    name: "CommonMain",
    props: ["withoutRight", "withoutLeft", "withoutBread"],
    data: function () {
        return {
            expanding: false,
            expandingRight: false,
        };
    },
    computed: {
        stickyHeader: function () {
            return this.withoutBread;
        },
    },
    watch: {
        withoutLeft: function (newval) {
            this.expanding = this.withoutLeft === undefined ? false : newval;
        },
        withoutRight: function (newval) {
            this.expandingRight = this.withoutRight === undefined ? false : newval;
        },
    },
    methods: {},
    mounted: function () {
        Bus.on("toggleLeftSide", (data) => {
            this.expanding = !data;
        });
        Bus.on("toggleRightSide", (data) => {
            this.expandingRight = !data;
        });
    },
    created: function () {
        this.expanding = this.withoutLeft === undefined ? false : !!this.withoutLeft;
        this.expandingRight = this.withoutRight === undefined ? false : !!this.withoutRight;
    },
};
</script>

<style lang="less">
@import "../assets/css/common/main.less";
</style>

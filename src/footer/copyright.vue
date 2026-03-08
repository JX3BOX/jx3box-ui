<template>
    <div
        class="flex flex-col items-center justify-between pt-8 text-gray-500 md:flex-row"
        style="border-top: 1px solid rgba(55, 65, 81, 1); font-size: 11px"
    >
        <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start">
            <span>© 2019-2026 JX3BOX. 由有爱玩家驱动。</span>
            <a
                class="text-gray-500 hover:underline"
                href="https://beian.miit.gov.cn/"
                target="_blank"
                rel="noopener noreferrer"
            >
                湘ICP备2021002288号
            </a>
        </div>
        <div class="mt-4 flex items-center space-x-6 md:mt-0">
            <a
                class="text-gray-500 transition-colors hover:text-white"
                href="https://rx-planet.com/contact"
                target="_blank"
                rel="noopener noreferrer"
            >
                联系我们
            </a>
            <a
                class="text-gray-500 transition-colors hover:text-white"
                href="https://www.jx3box.com/feedback"
                target="_blank"
                rel="noopener noreferrer"
            >
                反馈建议
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "FooterCopyright",
    props: [],
    components: {},
    data: function () {
        return {};
    },
    computed: {},
    watch: {},
    methods: {},
    created: function () {},
    mounted: function () {},
};
</script>

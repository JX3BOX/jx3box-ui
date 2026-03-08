<template>
    <div class="c-header-panel" id="c-header-panel">
        <el-tooltip
            effect="dark"
            :content="$jx3boxT('jx3boxUi.header.createCenter', '创作中心')"
            placement="bottom"
            popper-class="c-header-tooltip"
        >
            <a class="u-post" :href="url">
                <!-- <editIcon class="u-add" /> -->
                <img
                    class="u-add"
                    svg-inline
                    src="../../assets/img/common/edit.svg"
                    :alt="$jx3boxT('jx3boxUi.header.createCenter', '创作中心')"
                />
            </a>
        </el-tooltip>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import i18nMixin from "../../i18n/mixin";
// import editIcon from "@/assets/img/components/common/header/edit.svg";
export default {
    name: "publish",
    mixins: [i18nMixin],
    components: {
        // editIcon,
    },
    data: function () {
        return {
            url: JX3BOX.__Links.dashboard.publish,
        };
    },
};
</script>

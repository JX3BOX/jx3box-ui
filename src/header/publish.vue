<template>
    <div class="c-header-panel" id="c-header-panel">
        <el-tooltip effect="dark" content="创作中心" placement="bottom" popper-class="c-header-tooltip">
            <a class="u-post" :href="url">
                <!-- <editIcon class="u-add" /> -->
                 <img class="u-add" svg-inline src="../../assets/img/common/edit.svg" alt="创作中心">
            </a>
        </el-tooltip>
    </div>
</template>

<script>
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
// import editIcon from "@/assets/img/components/common/header/edit.svg";
export default {
    name: "publish",
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

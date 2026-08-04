import ManagePanelStage from "./ManagePanelStage.vue";

export default {
    title: "Layout/CommonHeader/ManagePanel",
    component: ManagePanelStage,
    parameters: {
        layout: "fullscreen",
    },
};

export const Refined = {
    render: () => ({
        components: { ManagePanelStage },
        template: "<ManagePanelStage />",
    }),
};

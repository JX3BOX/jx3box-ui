import CommonFooter from '../../CommonFooter.vue';

const meta = {
    title: 'Layout/CommonFooter',
    component: CommonFooter,
    parameters: {
        layout: 'fullscreen',
        shell: {
            enabled: true,
            placement: 'footer',
            showFooter: false,
            showRightSidebar: false,
        },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { CommonFooter },
        template: `
            <div style="min-height: 100vh; display: flex; align-items: flex-end;">
                <CommonFooter style="width: 100%;" />
            </div>
        `,
    }),
};

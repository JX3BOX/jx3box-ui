import CommonFooter from '../../CommonFooter.vue';

const meta = {
    title: 'Layout/CommonFooter',
    component: CommonFooter,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { CommonFooter },
        template: `
            <div style="min-height: 100vh; display: flex; align-items: flex-end; background: #111827;">
                <CommonFooter style="width: 100%;" />
            </div>
        `,
    }),
};

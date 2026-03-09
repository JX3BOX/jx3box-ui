import CommonHeader from '../../CommonHeader.vue';

const meta = {
    title: 'Layout/CommonHeader',
    component: CommonHeader,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        overlayEnable: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        overlayEnable: false,
    },
    render: (args) => ({
        components: { CommonHeader },
        setup() {
            return { args };
        },
        template: `
            <div style="min-height: 200vh; background: linear-gradient(180deg, #0b1220 0%, #1f2937 100%);">
                <CommonHeader v-bind="args" />
                <div style="height: 1600px;"></div>
            </div>
        `,
    }),
};

export const Overlay = {
    args: {
        overlayEnable: true,
    },
    render: Default.render,
};

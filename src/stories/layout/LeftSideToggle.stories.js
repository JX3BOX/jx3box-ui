import LeftSideToggle from '../../LeftSideToggle.vue';

const meta = {
    title: 'Layout/LeftSideToggle',
    component: LeftSideToggle,
    parameters: {
        layout: 'fullscreen',
        shell: {
            enabled: true,
            placement: 'leftToggle',
            showLeftToggle: false,
        },
    },
    argTypes: {
        mobileOnly: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        mobileOnly: false,
    },
    render: (args) => ({
        components: { LeftSideToggle },
        setup() {
            return { args };
        },
        template: `
            <div style="display: inline-flex; align-items: center; padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,0.9); box-shadow: 0 8px 24px rgba(15,23,42,0.08);">
                <LeftSideToggle v-bind="args" />
                <span style="margin-left: 8px; color: #475569; font-size: 13px;">左侧边栏触发器</span>
            </div>
        `,
    }),
};

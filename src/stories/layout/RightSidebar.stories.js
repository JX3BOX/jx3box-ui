import RightSidebar from '../../RightSidebar.vue';

const meta = {
    title: 'Layout/RightSidebar',
    component: RightSidebar,
    parameters: {
        layout: 'fullscreen',
        shell: {
            enabled: true,
            placement: 'right',
        },
    },
    argTypes: {
        showToggle: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        showToggle: true,
    },
    render: (args) => ({
        components: { RightSidebar },
        setup() {
            return { args };
        },
        template: `
            <RightSidebar v-bind="args">
                <div style="border-radius: 18px; background: rgba(255,255,255,0.88); padding: 20px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <div style="font-weight: 700; color: #0f172a;">RightSidebar</div>
                    <p style="margin-top: 8px; color: #475569; line-height: 1.7;">
                        右栏一般承载目录、推荐内容、主题信息或辅助说明模块。
                    </p>
                </div>
            </RightSidebar>
        `,
    }),
};

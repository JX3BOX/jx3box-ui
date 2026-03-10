import LeftSidebar from '../../LeftSidebar.vue';

const meta = {
    title: 'Layout/LeftSidebar',
    component: LeftSidebar,
    parameters: {
        layout: 'fullscreen',
        shell: {
            enabled: true,
            placement: 'left',
            leftSidebarProps: {
                open: true,
            },
        },
    },
    argTypes: {
        open: { control: 'boolean' },
        withoutBread: { control: 'boolean' },
        uid: { control: 'number' },
    },
};

export default meta;

export const Default = {
    args: {
        open: true,
        withoutBread: false,
        uid: null,
    },
    render: (args) => ({
        components: { LeftSidebar },
        setup() {
            return { args };
        },
        template: `
            <LeftSidebar v-bind="args">
                <div style="border-radius: 18px; background: rgba(255,255,255,0.88); padding: 20px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <div style="font-weight: 700; color: #0f172a;">LeftSidebar</div>
                    <p style="margin-top: 8px; color: #475569; line-height: 1.7;">
                        左栏通常用于承载作者、分类导航、作品集或筛选补充信息。
                    </p>
                </div>
            </LeftSidebar>
        `,
    }),
};

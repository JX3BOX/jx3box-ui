import Main from '../../Main.vue';

const meta = {
    title: 'Layout/Main',
    component: Main,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        withoutLeft: { control: 'boolean' },
        withoutRight: { control: 'boolean' },
        withoutBread: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        withoutLeft: false,
        withoutRight: false,
        withoutBread: false,
    },
    render: (args) => ({
        components: { Main },
        setup() {
            return { args };
        },
        template: `
            <Main v-bind="args">
                <div style="border-radius: 18px; background: rgba(255,255,255,0.92); box-shadow: 0 24px 60px rgba(15,23,42,0.08); padding: 32px; min-height: 360px;">
                    <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0ea5e9;">Main</div>
                    <h2 style="margin: 12px 0 0; font-size: 32px; line-height: 1.2; font-weight: 700; color: #0f172a;">主内容布局容器</h2>
                    <p style="margin-top: 16px; max-width: 42rem; color: #334155; line-height: 1.9;">
                        这里模拟单页正文区域，你可以把详情组件、筛选模块或任何内容组件直接挂进来查看与左右栏组合后的效果。
                    </p>
                </div>
            </Main>
        `,
    }),
};

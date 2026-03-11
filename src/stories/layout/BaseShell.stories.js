const meta = {
    title: 'Layout/BaseShell',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        template: `
            <section style="display: grid; gap: 20px;">
                <div style="border-radius: 18px; background: rgba(255,255,255,0.92); box-shadow: 0 24px 60px rgba(15,23,42,0.08); padding: 32px; min-height: 300px;">
                    <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0ea5e9;">README / 全局模块</div>
                    <h1 style="margin: 12px 0 0; font-size: 36px; line-height: 1.15; font-weight: 700; color: #0f172a;">Storybook 基座</h1>
                    <p style="margin-top: 16px; max-width: 44rem; color: #334155; line-height: 1.9;">
                        这个 story 复刻了 src/App.vue 的基础结构，包含公共头、面包屑、主内容区、左右侧栏和公共底。后续全局模块或内容组件都可以直接通过 parameters.shell 挂到对应区域里预览。
                    </p>
                </div>
                <div style="display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
                    <div style="border-radius: 16px; background: rgba(255,255,255,0.88); padding: 20px;">
                        <div style="font-weight: 700; color: #0f172a;">Header + Breadcrumb</div>
                        <p style="margin-top: 8px; color: #475569; line-height: 1.7;">模拟全局导航和频道入口。</p>
                    </div>
                    <div style="border-radius: 16px; background: rgba(255,255,255,0.88); padding: 20px;">
                        <div style="font-weight: 700; color: #0f172a;">Main + Sidebars</div>
                        <p style="margin-top: 8px; color: #475569; line-height: 1.7;">模拟详情页和筛选页的主要布局骨架。</p>
                    </div>
                    <div style="border-radius: 16px; background: rgba(255,255,255,0.88); padding: 20px;">
                        <div style="font-weight: 700; color: #0f172a;">Footer</div>
                        <p style="margin-top: 8px; color: #475569; line-height: 1.7;">保留全局落点，方便观察页面收尾效果。</p>
                    </div>
                </div>
            </section>
        `,
    }),
};

import CommonBottom from '../../CommonBottom.vue';

const meta = {
    title: 'Layout/CommonBottom',
    component: CommonBottom,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { CommonBottom },
        template: `
            <div style="min-height:100vh;display:flex;flex-direction:column;background:#f5f7fb;">
                <section style="margin:32px;border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <h2 style="margin:0;font-size:28px;color:#0f172a;">CommonBottom</h2>
                    <p style="margin:12px 0 0;color:#475569;line-height:1.8;">移动端或轻量页面底部版权与反馈入口。</p>
                </section>
                <div style="margin-top:auto;">
                    <CommonBottom />
                </div>
            </div>
        `,
    }),
};

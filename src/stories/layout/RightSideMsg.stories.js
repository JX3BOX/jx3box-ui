import RightSideMsg from '../../RightSideMsg.vue';

const meta = {
    title: 'Layout/RightSideMsg',
    component: RightSideMsg,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { RightSideMsg },
        template: `
            <div style="display:grid;place-items:center;min-height:100vh;padding:32px;background:#f5f7fb;">
                <div style="width:min(420px,100%);display:grid;gap:24px;">
                    <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                        <h2 style="margin:0;font-size:28px;color:#0f172a;">RightSideMsg</h2>
                        <p style="margin:12px 0 0;color:#475569;line-height:1.8;">右侧栏提示信息容器，内容通过默认 slot 传入。</p>
                    </section>
                    <RightSideMsg>
                        <strong>资料提示</strong>
                        <p style="margin:8px 0 0;">这里可以放置目录、来源说明或侧栏辅助文案。</p>
                    </RightSideMsg>
                </div>
            </div>
        `,
    }),
};

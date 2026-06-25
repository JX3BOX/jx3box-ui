import Footer from '../../Footer.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Layout/Footer',
    component: Footer,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        darkMode: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        darkMode: false,
    },
    render: (args) => ({
        components: { Footer, StoryPropsTable },
        setup() {
            return {
                args,
                propsInfo: [
                    { name: 'darkMode', type: 'Boolean', default: 'false', description: '切换深色底部样式。' },
                ],
            };
        },
        template: `
            <div style="min-height:100vh;display:flex;flex-direction:column;background:#f5f7fb;">
                <div style="flex:1;display:grid;align-content:center;gap:24px;padding:32px;">
                    <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                        <h2 style="margin:0;font-size:28px;color:#0f172a;">Footer</h2>
                        <p style="margin:12px 0 0;color:#475569;line-height:1.8;">旧版公共底部，提供 ICP、帮助、仓库和反馈入口。</p>
                    </section>
                    <StoryPropsTable title="Footer" description="旧版公共底部参数说明。" :items="propsInfo" />
                </div>
                <Footer v-bind="args" />
            </div>
        `,
    }),
};

export const Dark = {
    args: {
        darkMode: true,
    },
    render: Default.render,
};

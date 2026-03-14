import QRcode from '../../interact/QRcode.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Interact/QRcode',
    component: QRcode,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        href: { control: 'text' },
        v: { control: 'radio', options: ['cms', 'static'] },
        s: { control: { type: 'number', min: 80, max: 240, step: 10 } },
    },
};

export default meta;

export const Default = {
    args: {
        href: 'https://www.jx3box.com',
        v: 'cms',
        s: 120,
    },
    render: (args) => ({
        components: { QRcode, StoryPropsTable },
        setup() {
            return {
                args,
                propsInfo: [
                    { name: 'href', type: 'String', default: 'location.href', description: '二维码指向地址。' },
                    { name: 'v', type: 'String', default: '"cms"', description: '展示模式，支持弹出态和静态态。' },
                    { name: 's', type: 'Number', default: '100', description: '二维码尺寸。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;padding:32px;background:linear-gradient(180deg,#f8fafc 0%,#eef2f7 100%);min-height:100vh;">
                <section style="display:flex;align-items:center;justify-content:space-between;gap:24px;padding:24px;border-radius:20px;background:rgba(255,255,255,0.92);box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <div>
                        <h2 style="margin:0;font-size:28px;color:#0f172a;">QRcode</h2>
                        <p style="margin:12px 0 0;color:#475569;line-height:1.8;">用于文章和百科详情页中的扫码访问入口。</p>
                    </div>
                    <QRcode v-bind="args" />
                </section>
                <StoryPropsTable title="QRcode" description="二维码组件参数说明。" :items="propsInfo" />
            </div>
        `,
    }),
};

export const StaticCard = {
    args: {
        href: 'https://www.jx3box.com/wiki/achievement/1001',
        v: 'static',
        s: 140,
    },
    render: Default.render,
};

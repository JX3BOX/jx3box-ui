import Icon from '../../Icon.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import logoPath from '../../../assets/img/common/logo.svg';

const meta = {
    title: 'Layout/Icon',
    component: Icon,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        type: { control: 'radio', options: ['inline', 'sprite', 'lucide', 'font-awesome'] },
        name: { control: 'text' },
        path: { control: 'text' },
        prefix: { control: 'text' },
        size: { control: 'text' },
    },
};

export default meta;

const iconRows = [
    { label: 'Inline SVG', props: { type: 'inline', path: logoPath, size: 40 } },
    { label: 'Sprite symbol', props: { type: 'sprite', name: 'setting', prefix: 'icon-', size: 32 } },
    { label: 'Lucide placeholder', props: { type: 'lucide', name: 'settings', size: 32 } },
    { label: 'Font class', props: { type: 'font-awesome', name: 'fa-solid fa-star', size: 32 } },
];

export const Default = {
    args: {
        type: 'inline',
        name: '',
        path: logoPath,
        prefix: 'icon-',
        size: 40,
    },
    render: (args) => ({
        components: { Icon, StoryPropsTable },
        setup() {
            return {
                args,
                iconRows,
                propsInfo: [
                    { name: 'type', type: 'String', default: '"inline"', description: '渲染模式：inline、sprite、lucide、font-awesome。' },
                    { name: 'name', type: 'String', default: '""', description: '图标名或 class 名。' },
                    { name: 'path', type: 'String', default: '""', description: 'inline 模式使用的 SVG 路径。' },
                    { name: 'prefix', type: 'String', default: '"icon-"', description: 'sprite symbol 前缀。' },
                    { name: 'size', type: 'Number | String', default: '24', description: '图标尺寸，数字按 px 处理。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;padding:32px;background:#f5f7fb;min-height:100vh;">
                <section style="display:grid;gap:20px;border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <div>
                        <h2 style="margin:0;font-size:28px;color:#0f172a;">Icon</h2>
                        <p style="margin:12px 0 0;color:#475569;line-height:1.8;">统一展示图标组件的四种输入方式；部分模式依赖业务侧已注册的 symbol 或字体。</p>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:16px;">
                        <div style="display:grid;gap:10px;justify-items:center;min-width:120px;padding:18px;border:1px solid rgba(15,23,42,0.08);border-radius:16px;background:#fff;" v-for="item in iconRows" :key="item.label">
                            <Icon v-bind="item.props" />
                            <span style="font-size:13px;color:#475569;">{{ item.label }}</span>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:16px;padding:18px;border-radius:16px;background:#f8fafc;">
                        <span style="font-weight:700;color:#0f172a;">Args preview</span>
                        <Icon v-bind="args" />
                    </div>
                </section>
                <StoryPropsTable title="Icon" description="通用图标组件参数说明。" :items="propsInfo" />
            </div>
        `,
    }),
};

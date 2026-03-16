import GamePrice from '../../wiki/GamePrice.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Wiki/GamePrice',
    component: GamePrice,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        price: { control: 'text' },
        align: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        price: 123456789,
        align: false,
    },
    render: (args) => ({
        components: { GamePrice, StoryPropsTable },
        setup() {
            return {
                args,
                examples: [0, 520, 12888, 123456789, -20800],
                propsInfo: [
                    { name: 'price', type: 'Number | String', default: '0', description: '以铜为最小单位的游戏货币值。' },
                    { name: 'align', type: 'Boolean', default: 'false', description: '开启后按金额单位宽度对齐。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;padding:32px;background:linear-gradient(180deg,#f8fafc 0%,#eef2f7 100%);min-height:100vh;">
                <section style="display:grid;gap:20px;padding:24px;border-radius:20px;background:rgba(255,255,255,0.92);box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <div>
                        <h2 style="margin:0;font-size:28px;color:#0f172a;">GamePrice</h2>
                        <p style="margin:12px 0 0;color:#475569;line-height:1.8;">将整型金额拆解为砖金银铜并附带图标展示。</p>
                    </div>
                    <div style="font-size:28px;color:#0f172a;">
                        <GamePrice v-bind="args" />
                    </div>
                    <div style="display:grid;gap:12px;">
                        <div v-for="item in examples" :key="item" style="display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px 18px;border-radius:14px;background:#f8fafc;">
                            <code style="color:#475569;">{{ item }}</code>
                            <GamePrice :price="item" :align="args.align" />
                        </div>
                    </div>
                </section>
                <StoryPropsTable title="GamePrice" description="游戏金额展示组件入参。" :items="propsInfo" />
            </div>
        `,
    }),
};

export const Aligned = {
    args: {
        price: 123456789,
        align: true,
    },
    render: Default.render,
};

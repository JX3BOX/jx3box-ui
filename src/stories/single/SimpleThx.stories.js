import SimpleThx from '../../single/SimpleThx.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Single/SimpleThx',
    component: SimpleThx,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { SimpleThx, StoryPropsTable },
        setup() {
            return {
                presetConfig: { admin_max: 1000, admin_min: 10, admin_points: [10, 50, 100], admin_left: 4800, admin_total: 10000, user_points: [10, 20, 50], user_left: 820, boxcoin_enable: 1 },
                propsInfo: [
                    { name: 'postId', type: 'Number | String', default: '0', required: true, description: '文章 ID。' },
                    { name: 'postType', type: 'String', default: '""', required: true, description: '文章类型。' },
                    { name: 'postTitle', type: 'String', default: '""', description: '文章标题。' },
                    { name: 'userId', type: 'Number | String', default: '0', description: '作者 UID。' },
                    { name: 'adminBoxcoinEnable / userBoxcoinEnable', type: 'Boolean', default: 'false', description: '控制打赏区显示。' },
                    { name: 'presetConfig', type: 'Object', default: '{}', description: 'Storybook 下可直接注入打赏配置，避免空态。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <SimpleThx post-type="bbs" post-title="轻剑驭风版本攻略示例" :post-id="80449" :user-id="8" :admin-boxcoin-enable="true" :user-boxcoin-enable="true" :allow-gift="true" :preset-config="presetConfig" />
                </section>
                <StoryPropsTable title="SimpleThx" description="简化互动条组件。" :items="propsInfo" />
            </div>
        `,
    }),
};

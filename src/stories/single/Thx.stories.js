import Thx from '../../single/Thx.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Single/Thx',
    component: Thx,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { Thx, StoryPropsTable },
        setup() {
            return {
                propsInfo: [
                    { name: 'postId', type: 'Number | String', default: '0', required: true, description: '文章 ID。' },
                    { name: 'postType', type: 'String', default: '""', required: true, description: '文章类型。' },
                    { name: 'postTitle', type: 'String', default: '""', description: '文章标题。' },
                    { name: 'userId', type: 'Number | String', default: '0', description: '作者 UID。' },
                    { name: 'showRss', type: 'Boolean', default: 'false', description: '是否显示订阅按钮。' },
                    { name: 'adminBoxcoinEnable / userBoxcoinEnable', type: 'Boolean', default: 'false', description: '控制打赏模块显示。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <Thx post-type="bbs" post-title="轻剑驭风版本攻略示例" :post-id="80449" :user-id="8" :admin-boxcoin-enable="true" :user-boxcoin-enable="true" :allow-gift="true" :show-rss="true" author-id="8" category="post" />
                </section>
                <StoryPropsTable title="Thx" description="完整互动条组件。" :items="propsInfo" />
            </div>
        `,
    }),
};

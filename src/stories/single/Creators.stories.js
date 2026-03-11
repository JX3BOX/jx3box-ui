import Creators from '../../single/Creators.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Single/Creators',
    component: Creators,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { Creators, StoryPropsTable },
        setup() {
            return {
                propsInfo: [
                    { name: 'postId', type: 'Number | String', default: '0', required: true, description: '当前文章 ID。' },
                    { name: 'postType', type: 'String', default: '""', required: true, description: '文章类型，用于生成编辑链接。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <Creators :post-id="80449" post-type="bbs" />
                </section>
                <StoryPropsTable title="Creators" description="联合创作者展示组件。" :items="propsInfo" />
            </div>
        `,
    }),
};

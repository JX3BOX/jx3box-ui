import PostCollection from '../../single/PostCollection.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Single/PostCollection',
    component: PostCollection,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { PostCollection, StoryPropsTable },
        setup() {
            return {
                propsInfo: [
                    { name: 'id', type: 'Number | String', default: '0', description: '关联小册 ID，组件会自动请求列表。' },
                    { name: 'store', type: 'Object', default: 'null', description: '可直接传入包含 posts 的对象，跳过请求。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <PostCollection :id="1" />
                </section>
                <StoryPropsTable title="PostCollection" description="文章关联内容列表，通常用于右侧辅助阅读区域。" :items="propsInfo" />
            </div>
        `,
    }),
};

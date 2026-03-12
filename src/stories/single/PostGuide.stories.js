import PostGuide from '../../single/PostGuide.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const mockGuidePost = {
    prev_post: {
        ID: 80440,
        post_type: 'bbs',
        post_title: '上一期：配装思路回顾',
    },
    next_post: {
        ID: 80460,
        post_type: 'bbs',
        post_title: '下一期：实战循环拆解',
    },
};

const meta = {
    title: 'Single/PostGuide',
    component: PostGuide,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { PostGuide, StoryPropsTable },
        setup() {
            return {
                mockGuidePost,
                propsInfo: [
                    { name: 'post', type: 'Object', default: '{}', description: '包含 prev_post / next_post 的文章导航数据。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <PostGuide :post="mockGuidePost" />
                </section>
                <StoryPropsTable title="PostGuide" description="文章底部上一篇 / 下一篇导航。" :items="propsInfo" />
            </div>
        `,
    }),
};

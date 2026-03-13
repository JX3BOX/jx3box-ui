import PostVersion from '../../single/PostVersion.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import { mockPost } from '../mockData';

const meta = {
    title: 'Single/PostVersion',
    component: PostVersion,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { PostVersion, StoryPropsTable },
        setup() {
            return {
                storyPost: {
                    ...mockPost,
                    link_content_meta_id: 501,
                },
                propsInfo: [
                    { name: 'post', type: 'Object', default: '{}', required: true, description: '包含标题、正文和 `link_content_meta_id` 的文章对象。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <div style="margin-bottom:16px;color:#475569;line-height:1.8;">
                        该 story 已接入 mock 历史版本数据。点击“对比”可直接打开版本差异弹窗。
                    </div>
                    <PostVersion :post="storyPost" />
                </section>
                <StoryPropsTable title="PostVersion" description="文章历史版本列表与对比弹窗。" :items="propsInfo" />
            </div>
        `,
    }),
};

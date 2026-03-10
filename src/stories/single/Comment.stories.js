import Comment from '../../single/Comment.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Single/Comment',
    component: Comment,
    parameters: {
        layout: 'fullscreen',
        shell: { enabled: true, placement: 'main', showLeftSidebar: false, showRightSidebar: false },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { Comment, StoryPropsTable },
        setup() {
            return {
                propsInfo: [
                    { name: 'id', type: 'Number | String', default: '0', required: true, description: '评论目标 ID。' },
                    { name: 'category', type: 'String', default: '""', required: true, description: '评论分类，例如 post。' },
                    { name: 'normal', type: 'Boolean', default: 'true', description: '普通评论模式。' },
                    { name: 'order', type: 'String', default: '""', description: '初始排序模式。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <Comment category="post" :id="80449" />
                </section>
                <StoryPropsTable title="Comment" description="评论列表与输入组件。" :items="propsInfo" />
            </div>
        `,
    }),
};

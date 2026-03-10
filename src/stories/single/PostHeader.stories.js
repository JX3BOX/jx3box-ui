import PostHeader from '../../single/PostHeader.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import { mockPost, mockStat } from '../mockData';

const meta = {
    title: 'Single/PostHeader',
    component: PostHeader,
    parameters: {
        layout: 'fullscreen',
        shell: { enabled: true, placement: 'main', showLeftSidebar: false, showRightSidebar: false },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { PostHeader, StoryPropsTable },
        setup() {
            return {
                mockPost,
                mockStat,
                propsInfo: [
                    { name: 'post', type: 'Object', default: '{}', required: true, description: '文章标题、作者、客户端、时间等来源。' },
                    { name: 'stat', type: 'Object', default: '{}', description: '统计信息，常用为 views。' },
                    { name: 'titleExtra', type: 'String', default: '""', description: '是否展示额外标签区域。' },
                    { name: 'anonymous', type: 'Boolean', default: 'false', description: '匿名展示作者。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <PostHeader :post="mockPost" :stat="mockStat" title-extra="1" />
                </section>
                <StoryPropsTable title="PostHeader" description="单页顶部信息栏。" :items="propsInfo" />
            </div>
        `,
    }),
};

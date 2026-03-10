import Article from '../../editor/Article.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import { mockPost } from '../mockData';

const meta = {
    title: 'Single/Article',
    component: Article,
    parameters: {
        layout: 'fullscreen',
        shell: { enabled: true, placement: 'main', showLeftSidebar: false, showRightSidebar: false },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { Article, StoryPropsTable },
        setup() {
            return {
                mockPost,
                propsInfo: [
                    { name: 'content', type: 'String', default: '""', required: true, description: '正文 HTML 字符串。' },
                    { name: 'directorybox', type: 'String', default: '""', description: '目录挂载容器选择器。' },
                    { name: 'pageable', type: 'Boolean', default: 'true', description: '是否启用分页。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <Article :content="mockPost.post_content" :pageable="false" />
                </section>
                <StoryPropsTable title="Article" description="正文渲染组件。" :items="propsInfo" />
            </div>
        `,
    }),
};

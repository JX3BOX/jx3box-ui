import PostDirectory from '../../single/PostDirectory.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Single/PostDirectory',
    component: PostDirectory,
    parameters: {
        layout: 'fullscreen',
        shell: { enabled: true, placement: 'right', showLeftSidebar: false },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { PostDirectory, StoryPropsTable },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:20px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <PostDirectory />
                    <div class="c-article-directory" style="margin-top:12px;">
                        <h2>版本概览</h2>
                        <h3 class="lv2">核心思路</h3>
                        <h3 class="lv2">配装建议</h3>
                    </div>
                </section>
                <StoryPropsTable title="PostDirectory" description="当前组件本身无 props，主要配合正文目录渲染结果使用。" :items="[]" />
            </div>
        `,
    }),
};

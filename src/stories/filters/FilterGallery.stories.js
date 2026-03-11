import clientBy from '../../filters/clientBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import markBy from '../../filters/markBy.vue';
import menuBy from '../../filters/menuBy.vue';
import orderBy from '../../filters/orderBy.vue';
import tagBy from '../../filters/tagBy.vue';
import topicBy from '../../filters/topicBy.vue';
import versionBy from '../../filters/versionBy.vue';
import zlpBy from '../../filters/zlpBy.vue';

const meta = {
    title: 'Filters/Index',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: {
            clientBy,
            StoryPropsTable,
            markBy,
            menuBy,
            orderBy,
            tagBy,
            topicBy,
            versionBy,
            zlpBy,
        },
        data() {
            return {
                selectedTopic: '',
                menuOptions: {
                    pve: '副本',
                    pvp: '竞技',
                    tool: '工具',
                },
                tagOptions: {
                    beginner: '入门',
                    build: '配装',
                    macro: '宏循环',
                },
                topics: ['版本速报', '配装思路', '副本机制'],
                filterProps: [
                    {
                        title: 'clientBy / versionBy',
                        description: '客户端与版本筛选类组件。',
                        items: [
                            { name: 'type / value', type: 'String', default: '""', description: '当前激活项。' },
                            { name: 'clients', type: 'Object', default: 'null', description: 'clientBy 自定义客户端列表。' },
                            { name: 'showWujie', type: 'Boolean', default: 'false', description: 'clientBy 是否展示无界。' },
                        ],
                    },
                    {
                        title: 'markBy / menuBy / orderBy / tagBy / zlpBy',
                        description: '下拉或条件筛选组件。',
                        items: [
                            { name: 'data / marks', type: 'Object', default: '{}', description: '候选项映射。' },
                            { name: 'placeholder', type: 'String', default: '""', description: '未选中时展示文案。' },
                            { name: 'type', type: 'String', default: '组件内默认值', description: 'emit 时返回的筛选键。' },
                            { name: 'client', type: 'String', default: '""', description: 'zlpBy 根据客户端决定资料片列表。' },
                        ],
                    },
                    {
                        title: 'topicBy',
                        description: '主题选择组件，推荐配合 v-model 使用。',
                        items: [
                            { name: 'topics', type: 'Array', default: '[]', required: true, description: '主题列表。' },
                            { name: 'modelValue', type: 'String', default: '""', description: '当前选中主题。' },
                            { name: 'label', type: 'String', default: '"主题"', description: '未选中时显示文案。' },
                        ],
                    },
                ],
            };
        },
        template: `
            <div style="display: grid; gap: 24px;">
                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #0ea5e9;">list</div>
                    <h2 style="margin: 10px 0 0; font-size: 28px; color: #0f172a;">筛选模块总览</h2>
                    <p style="margin-top: 12px; color: #475569; line-height: 1.8;">README 中的筛选模块在这里统一展示，方便查看组件外观和交互手感。</p>
                </section>

                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
                        <clientBy :show-wujie="true" />
                        <markBy style="position:relative;top:4px;" />
                        <menuBy style="position:relative;top:4px;" :data="menuOptions" placeholder="栏目" />
                        <orderBy />
                        <tagBy :data="tagOptions" />
                        <topicBy v-model="selectedTopic" :topics="topics" />
                        <versionBy />
                        <zlpBy client="std" style="position:relative;top:4px;" />
                    </div>
                </section>

                <StoryPropsTable
                    v-for="item in filterProps"
                    :key="item.title"
                    :title="item.title"
                    :description="item.description"
                    :items="item.items"
                />
            </div>
        `,
    }),
};

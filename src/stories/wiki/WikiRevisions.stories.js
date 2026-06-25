import WikiRevisions from '../../wiki/WikiRevisions.vue';
import StorybookShell from '../layout/StorybookShell.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Wiki/WikiRevisions',
    component: WikiRevisions,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        type: { control: 'text' },
        sourceId: { control: 'number' },
        isGame: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        type: 'achievement',
        sourceId: 1001,
        isGame: false,
    },
    render: (args) => ({
        components: { WikiRevisions, StorybookShell, StoryPropsTable },
        setup() {
            return {
                args,
                propsInfo: [
                    { name: 'type', type: 'String', default: '""', description: '百科条目类型。' },
                    { name: 'sourceId', type: 'Number | String', default: '""', description: '百科条目源 ID。' },
                    { name: 'isGame', type: 'Boolean | Number', default: 'false', description: '是否按游戏内链接前缀生成跳转地址。' },
                ],
            };
        },
        template: `
            <StorybookShell placement="main" :show-right-sidebar="false">
                <div style="display:grid;gap:24px;">
                    <WikiRevisions v-bind="args" />
                    <StoryPropsTable title="WikiRevisions" description="百科历史版本列表。" :items="propsInfo" />
                </div>
            </StorybookShell>
        `,
    }),
};

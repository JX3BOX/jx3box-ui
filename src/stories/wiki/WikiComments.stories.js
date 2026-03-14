import WikiComments from '../../wiki/WikiComments.vue';
import StorybookShell from '../layout/StorybookShell.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

function seedEditorSession() {
    try {
        localStorage.setItem('created_at', String(Date.now()));
        localStorage.setItem('logged_in', 'true');
        localStorage.setItem('group', '64');
        localStorage.setItem('name', 'Storybook编辑者');
        localStorage.setItem('uid', '8');
        localStorage.setItem('avatar', 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png');
    } catch (e) {
        // ignore storage failures in restricted contexts
    }
}

const meta = {
    title: 'Wiki/WikiComments',
    component: WikiComments,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        type: { control: 'text' },
        sourceId: { control: 'number' },
    },
};

export default meta;

export const Default = {
    args: {
        type: 'achievement',
        sourceId: 1001,
    },
    render: (args) => ({
        components: { WikiComments, StorybookShell, StoryPropsTable },
        setup() {
            seedEditorSession();
            return {
                args,
                propsInfo: [
                    { name: 'type', type: 'String', default: '""', description: '百科条目类型。' },
                    { name: 'sourceId', type: 'Number | String', default: '0', description: '百科条目源 ID。' },
                ],
            };
        },
        template: `
            <StorybookShell placement="main" :show-right-sidebar="false">
                <div style="display:grid;gap:24px;">
                    <WikiComments v-bind="args" />
                    <StoryPropsTable title="WikiComments" description="百科评论区，已接入 Storybook mock 数据。" :items="propsInfo" />
                </div>
            </StorybookShell>
        `,
    }),
};

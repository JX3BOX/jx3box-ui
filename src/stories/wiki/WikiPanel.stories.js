import WikiPanel from '../../wiki/WikiPanel.vue';
import { mockWikiPost } from '../mockData';
import StorybookShell from '../layout/StorybookShell.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Wiki/WikiPanel',
    component: WikiPanel,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { WikiPanel, StorybookShell, StoryPropsTable },
        setup() {
            return {
                mockWikiPost,
                propsInfo: [
                    { name: 'wikiPost', type: 'Object', default: 'null', description: '百科详情数据，包含 post/users/source_id/type。' },
                    { name: 'scene', type: 'String', default: '"default"', description: '面板所处场景，详情页使用 detail。' },
                    { name: 'borderNone', type: 'Boolean', default: 'false', description: '控制外层是否显示边框。' },
                    { name: 'showQR', type: 'Boolean', default: 'true', description: '在详情场景中展示二维码入口。' },
                ],
            };
        },
        template: `
            <StorybookShell placement="main" :show-right-sidebar="false">
                <div style="display:grid;gap:24px;">
                    <WikiPanel :wiki-post="mockWikiPost" scene="detail">
                        <template #head-title>
                            <span>百科条目概览</span>
                        </template>
                        <template #head-actions>
                            <el-tag type="success">已发布</el-tag>
                        </template>
                        <template #body>
                            <div style="padding:4px 0 0;line-height:1.9;color:#475569;">
                                这里模拟百科详情页中的信息面板，可同时查看贡献者、热度、更新时间与二维码入口。
                            </div>
                        </template>
                    </WikiPanel>
                    <StoryPropsTable title="WikiPanel" description="百科信息面板基础容器。" :items="propsInfo" />
                </div>
            </StorybookShell>
        `,
    }),
};

export const PlainPanel = {
    render: () => ({
        components: { WikiPanel, StorybookShell },
        template: `
            <StorybookShell placement="main" :show-left-sidebar="false" :show-right-sidebar="false">
                <WikiPanel :border-none="true" :show-qr="false">
                    <template #head-title>
                        <span>普通面板</span>
                    </template>
                    <template #body>
                        <div style="line-height:1.9;color:#475569;">不传 \`wikiPost\` 时可作为通用分区容器使用。</div>
                    </template>
                </WikiPanel>
            </StorybookShell>
        `,
    }),
};

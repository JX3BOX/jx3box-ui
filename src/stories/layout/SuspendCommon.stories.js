import SuspendCommon from '../../SuspendCommon.vue';
import SuspendCommonStage from './SuspendCommonStage.vue';

const meta = {
    title: 'Layout/SuspendCommon',
    component: SuspendCommon,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        btnOptions: { control: 'object' },
        drawerOptions: { control: 'object' },
        fixPageOptions: { control: 'object' },
    },
};

export default meta;

export const Default = {
    args: {
        btnOptions: {
            showHome: true,
            showIcon: false,
            showPin: false,
            showMore: true,
        },
        drawerOptions: {
            author: {
                name: '作者名字',
                avatar: 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png',
                author_id: 8,
            },
            subscribeType: '',
            postType: '',
            id: '',
            title: 'Storybook 悬浮窗',
            hideType: ['collect', 'rss', 'laterOn', 'report'],
        },
        fixPageOptions: {
            key: 'storybook-fixed',
            title: 'Storybook 悬浮窗',
            url: 'https://storybook.local/suspend',
        },
    },
    render: (args) => ({
        components: { SuspendCommon, SuspendCommonStage },
        setup() {
            return { args };
        },
        methods: {
            handleSearch(keyword) {
                console.log('storybook suspend search', keyword);
            },
        },
        template: `
            <SuspendCommonStage>
                <SuspendCommon v-bind="args" @search="handleSearch">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <span style="font-weight: 700;">切换</span>
                        <span>收藏</span>
                        <span>分享</span>
                    </div>
                </SuspendCommon>
            </SuspendCommonStage>
        `,
    }),
};

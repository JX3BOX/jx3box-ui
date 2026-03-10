import UserPop from '../../author/UserPop.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Other/UserPop',
    component: UserPop,
    parameters: {
        layout: 'fullscreen',
        shell: {
            enabled: true,
            placement: 'main',
            showLeftSidebar: false,
            showRightSidebar: false,
        },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { UserPop, StoryPropsTable },
        data() {
            return {
                visible: false,
                propsInfo: [
                    { name: 'title', type: 'String', default: '""', description: '弹窗标题。' },
                    { name: 'show', type: 'Boolean', default: 'false', description: '外部控制弹窗开关。' },
                ],
            };
        },
        methods: {
            switchUserPop(val) {
                this.visible = val;
            },
            openDialog() {
                this.visible = false;
                this.$nextTick(() => {
                    this.visible = true;
                });
            },
        },
        template: `
            <div style="display: grid; gap: 24px;">
                <section style="border-radius: 20px; background: rgba(255,255,255,0.92); padding: 24px; box-shadow: 0 24px 60px rgba(15,23,42,0.08);">
                    <h2 style="margin: 0; font-size: 28px; color: #0f172a;">UserPop</h2>
                    <p style="margin-top: 12px; color: #475569; line-height: 1.8;">用于搜索并确认用户的弹窗组件。</p>
                    <el-button type="primary" @click="openDialog">重新打开弹窗</el-button>
                </section>
                <StoryPropsTable title="UserPop" description="搜索用户弹窗的入参说明。" :items="propsInfo" />
                <UserPop title="选择用户" :show="visible" @switchUserPop="switchUserPop">
                    可以输入 UID 或昵称进行搜索。
                </UserPop>
            </div>
        `,
    }),
};

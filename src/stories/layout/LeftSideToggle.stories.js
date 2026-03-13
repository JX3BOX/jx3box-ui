import LeftSideToggle from '../../LeftSideToggle.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import Bus from '../../../utils/bus';

const meta = {
    title: 'Layout/LeftSideToggle',
    component: LeftSideToggle,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        mobileOnly: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        mobileOnly: false,
    },
    render: (args) => ({
        components: { LeftSideToggle, StoryPropsTable },
        setup() {
            return { args };
        },
        data() {
            return {
                leftOpen: true,
                propsInfo: [
                    { name: 'mobileOnly', type: 'Boolean', default: 'false', description: '是否只在移动端显示折叠按钮。' },
                ],
            };
        },
        mounted() {
            this.__storyToggleHandler = (status) => {
                this.leftOpen = status;
            };
            Bus.on('toggleLeftSide', this.__storyToggleHandler);
            Bus.emit('toggleLeftSide', true);
        },
        beforeUnmount() {
            if (this.__storyToggleHandler) {
                Bus.off('toggleLeftSide', this.__storyToggleHandler);
                this.__storyToggleHandler = null;
            }
        },
        methods: {
            reopen() {
                Bus.emit('toggleLeftSide', true);
            },
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
                        <div>
                            <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0ea5e9;">layout</div>
                            <h2 style="margin:10px 0 0;font-size:28px;color:#0f172a;">LeftSideToggle</h2>
                            <p style="margin-top:12px;color:#475569;line-height:1.8;">点击图标会通过事件总线切换左栏开关，适合与 LeftSidebar、Main 配合使用。</p>
                        </div>
                        <div style="display:flex;align-items:center;gap:16px;">
                            <div style="padding:8px 14px;border-radius:999px;background:#e2e8f0;color:#0f172a;font-weight:700;">
                                当前状态：{{ leftOpen ? '展开' : '收起' }}
                            </div>
                            <button type="button" class="el-button el-button--primary is-plain" @click="reopen">重置为展开</button>
                        </div>
                    </div>
                    <div style="margin-top:24px;display:flex;align-items:center;gap:16px;padding:20px;border-radius:16px;background:linear-gradient(135deg,#f8fafc 0%,#e0f2fe 100%);">
                        <LeftSideToggle v-bind="args" />
                        <div style="color:#334155;line-height:1.7;">左栏折叠按钮预览区域</div>
                    </div>
                </section>
                <StoryPropsTable title="LeftSideToggle" description="左侧边栏开关按钮，通过事件总线广播状态。" :items="propsInfo" />
            </div>
        `,
    }),
};

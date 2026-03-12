import { onMounted, onBeforeUnmount, ref } from 'vue';
import RightAffix from '../../single/RightAffix.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import Bus from '../../../utils/bus';

const meta = {
    title: 'Single/RightAffix',
    component: RightAffix,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        postId: { control: 'number' },
        postType: { control: 'text' },
        postTitle: { control: 'text' },
        showComment: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        postId: 80449,
        postType: 'bbs',
        postTitle: '轻剑驭风版本攻略示例',
        showComment: true,
    },
    render: (args) => ({
        components: { RightAffix, StoryPropsTable },
        setup() {
            const commentCount = ref(0);

            const onToComment = () => {
                commentCount.value += 1;
            };

            const openAffix = () => Bus.emit('toggleRightSide', true);
            const closeAffix = () => Bus.emit('toggleRightSide', false);

            onMounted(() => {
                // 触发一次滚动事件，方便在 Storybook 中更容易观察“回到顶部”按钮
                window.scrollTo({ top: 1200 });
                window.dispatchEvent(new Event('scroll'));
            });

            onBeforeUnmount(() => {
                window.scrollTo({ top: 0 });
            });

            return {
                args,
                commentCount,
                onToComment,
                openAffix,
                closeAffix,
                propsInfo: [
                    { name: 'postId', type: 'String | Number', default: '""', description: '当前文章 ID，用于收藏查询。' },
                    { name: 'postType', type: 'String', default: '""', description: '文章类型，例如 bbs / pvx。' },
                    { name: 'postTitle', type: 'String', default: '""', description: '文章标题，用于收藏请求。' },
                    { name: 'showComment', type: 'Boolean | Number', default: 'false', description: '是否展示评论入口按钮。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="position:relative;min-height:180vh;border-radius:20px;background:linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <div style="max-width:760px;color:#334155;line-height:1.8;">
                        <h3 style="margin:0 0 12px;font-size:22px;color:#0f172a;">RightAffix 交互舞台</h3>
                        <p style="margin:0 0 10px;">该组件固定在右侧，包含收藏、评论入口和回到顶部。你可以通过下方按钮模拟右栏展开/收起。</p>
                        <p style="margin:0;">评论按钮点击次数：<strong>{{ commentCount }}</strong></p>
                        <div style="display:flex;gap:12px;margin-top:16px;">
                            <button type="button" class="el-button el-button--primary el-button--small" @click="openAffix">展开</button>
                            <button type="button" class="el-button el-button--small is-plain" @click="closeAffix">收起</button>
                        </div>
                    </div>

                    <RightAffix v-bind="args" @toComment="onToComment" />
                </section>
                <StoryPropsTable title="RightAffix" description="单页右侧悬浮交互区，依赖收藏组件与滚动状态。" :items="propsInfo" />
            </div>
        `,
    }),
};

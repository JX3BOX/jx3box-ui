import clientBy from '../../filters/clientBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Filters/clientBy',
    component: clientBy,
    parameters: {
        layout: 'fullscreen',
        shell: { enabled: true, placement: 'main', showLeftSidebar: false, showRightSidebar: false },
    },
};
export default meta;
export const Default = {
    render: () => ({
        components: { clientBy, StoryPropsTable },
        setup() {
            return { propsInfo: [
                { name: 'type', type: 'String', default: '""', description: '当前选中的客户端值。' },
                { name: 'clients', type: 'Object', default: 'null', description: '自定义客户端映射。' },
                { name: 'showWujie', type: 'Boolean', default: 'false', description: '是否显示无界。' },
            ] };
        },
        template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><clientBy :show-wujie="true" /></section><StoryPropsTable title="clientBy" description="客户端筛选组件。" :items="propsInfo" /></div>`,
    }),
};

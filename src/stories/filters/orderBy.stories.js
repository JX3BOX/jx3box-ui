import orderBy from '../../filters/orderBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = { title: 'Filters/orderBy', component: orderBy, parameters: { layout: 'fullscreen' } };
export default meta;
export const Default = { render: () => ({ components: { orderBy, StoryPropsTable }, setup() { return { propsInfo: [] }; }, template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><orderBy /></section><StoryPropsTable title="orderBy" description="当前组件无 props，通过内部状态管理排序选项。" :items="propsInfo" /></div>` }) };

import zlpBy from '../../filters/zlpBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = { title: 'Filters/zlpBy', component: zlpBy, parameters: { layout: 'fullscreen' } };
export default meta;
export const Default = { render: () => ({ components: { zlpBy, StoryPropsTable }, setup() { return { propsInfo: [ { name: 'client', type: 'String', default: '""', description: '按客户端切换资料片列表。' } ] }; }, template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><zlpBy client="std" /></section><StoryPropsTable title="zlpBy" description="资料片筛选组件。" :items="propsInfo" /></div>` }) };

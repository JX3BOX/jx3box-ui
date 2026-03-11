import markBy from '../../filters/markBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = { title: 'Filters/markBy', component: markBy, parameters: { layout: 'fullscreen' } };
export default meta;
export const Default = { render: () => ({ components: { markBy, StoryPropsTable }, setup() { return { propsInfo: [ { name: 'placeholder', type: 'String', default: '""', description: '默认展示文案。' }, { name: 'type', type: 'String', default: '"mark"', description: 'emit 时返回的筛选键。' }, { name: 'marks', type: 'Object', default: 'default_marks', description: '精选项映射。' } ] }; }, template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><markBy /></section><StoryPropsTable title="markBy" description="精选标记筛选组件。" :items="propsInfo" /></div>` }) };

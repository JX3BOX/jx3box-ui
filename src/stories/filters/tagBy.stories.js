import tagBy from '../../filters/tagBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = { title: 'Filters/tagBy', component: tagBy, parameters: { layout: 'fullscreen' } };
export default meta;
export const Default = { render: () => ({ components: { tagBy, StoryPropsTable }, data() { return { dataMap: { beginner: '入门', build: '配装', macro: '宏循环' }, propsInfo: [ { name: 'data', type: 'Object', default: '{}', required: true, description: '标签映射。' }, { name: 'type', type: 'String', default: '"tag"', description: 'emit 类型。' } ] }; }, template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><tagBy :data="dataMap" /></section><StoryPropsTable title="tagBy" description="标签筛选组件。" :items="propsInfo" /></div>` }) };

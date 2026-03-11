import menuBy from '../../filters/menuBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = { title: 'Filters/menuBy', component: menuBy, parameters: { layout: 'fullscreen' } };
export default meta;
export const Default = { render: () => ({ components: { menuBy, StoryPropsTable }, data() { return { dataMap: { pve: '副本', pvp: '竞技', tool: '工具' }, propsInfo: [ { name: 'data', type: 'Object', default: '{}', required: true, description: '候选项映射。' }, { name: 'type', type: 'String', default: '"menu"', description: 'emit 类型。' }, { name: 'placeholder', type: 'String', default: '""', description: '默认文案。' } ] }; }, template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><menuBy :data="dataMap" placeholder="栏目" /></section><StoryPropsTable title="menuBy" description="通用下拉筛选组件。" :items="propsInfo" /></div>` }) };

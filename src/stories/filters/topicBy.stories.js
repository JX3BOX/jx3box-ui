import TopicBy from '../../filters/topicBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = { title: 'Filters/topicBy', component: TopicBy, parameters: { layout: 'fullscreen' } };
export default meta;
export const Default = { render: () => ({ components: { TopicBy, StoryPropsTable }, data() { return { selected: '', propsInfo: [ { name: 'topics', type: 'Array', default: '[]', required: true, description: '主题列表。' }, { name: 'modelValue', type: 'String', default: '""', description: '当前选中值。' }, { name: 'label', type: 'String', default: '"主题"', description: '默认文案。' } ] }; }, template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><TopicBy v-model="selected" :topics="['版本速报','配装思路','副本机制']" /></section><StoryPropsTable title="topicBy" description="主题筛选组件，推荐用 v-model。" :items="propsInfo" /></div>` }) };

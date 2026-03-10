import versionBy from '../../filters/versionBy.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = { title: 'Filters/versionBy', component: versionBy, parameters: { layout: 'fullscreen', shell: { enabled: true, placement: 'main', showLeftSidebar: false, showRightSidebar: false } } };
export default meta;
export const Default = { render: () => ({ components: { versionBy, StoryPropsTable }, setup() { return { propsInfo: [ { name: 'value', type: 'String | Number', default: '""', description: '默认版本值。' } ] }; }, template: `<div style="display:grid;gap:24px;"><section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);"><versionBy /></section><StoryPropsTable title="versionBy" description="双端/旗舰/无界筛选。" :items="propsInfo" /></div>` }) };

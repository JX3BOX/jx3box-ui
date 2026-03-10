import Collection from '../../single/Collection.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';

const meta = {
    title: 'Single/Collection',
    component: Collection,
    parameters: {
        layout: 'fullscreen',
        shell: { enabled: true, placement: 'main', showLeftSidebar: false, showRightSidebar: false },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { Collection, StoryPropsTable },
        setup() {
            return {
                propsInfo: [
                    { name: 'id', type: 'Number | String', default: '0', required: true, description: '小册 ID。' },
                    { name: 'defaultVisible', type: 'Boolean', default: 'false', description: '默认是否展开。' },
                ],
            };
        },
        template: `
            <div style="display:grid;gap:24px;">
                <section style="border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                    <Collection :id="1" :default-visible="true" />
                </section>
                <StoryPropsTable title="Collection" description="文章所属小册展示。" :items="propsInfo" />
            </div>
        `,
    }),
};

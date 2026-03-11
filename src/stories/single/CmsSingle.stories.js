import CmsSingle from '../../single/CmsSingle.vue';
import CmsSingleStoryStage from './CmsSingleStoryStage.vue';

const meta = {
    title: 'Single/CmsSingle',
    component: CmsSingle,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { CmsSingleStoryStage },
        template: `<CmsSingleStoryStage />`,
    }),
};

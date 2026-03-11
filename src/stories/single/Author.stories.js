import SingleAuthor from '../../single/Author.vue';
import AuthorStoryStage from './AuthorStoryStage.vue';

const meta = {
    title: 'Single/Author',
    component: SingleAuthor,
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { AuthorStoryStage },
        template: `<AuthorStoryStage />`,
    }),
};

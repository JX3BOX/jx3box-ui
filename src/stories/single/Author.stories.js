import SingleAuthor from '../../single/Author.vue';
import AuthorStoryStage from './AuthorStoryStage.vue';

const meta = {
    title: 'Single/Author',
    component: SingleAuthor,
    parameters: {
        layout: 'fullscreen',
        shell: { enabled: true, placement: 'main', showLeftSidebar: false, showRightSidebar: false },
    },
};

export default meta;

export const Default = {
    render: () => ({
        components: { AuthorStoryStage },
        template: `<AuthorStoryStage />`,
    }),
};

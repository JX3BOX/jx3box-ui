import Breadcrumb from '../../Breadcrumb.vue';

const meta = {
    title: 'Layout/Breadcrumb',
    component: Breadcrumb,
    parameters: {
        layout: 'fullscreen',
        shell: {
            enabled: true,
            placement: 'breadcrumb',
            showBreadcrumb: false,
        },
    },
    argTypes: {
        publishEnable: { control: 'boolean' },
        feedbackEnable: { control: 'boolean' },
        adminEnable: { control: 'boolean' },
        crumbEnable: { control: 'boolean' },
        withoutLeft: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        name: '频道名称',
        slug: 'story',
        root: '/story',
        publishEnable: true,
        feedbackEnable: true,
        adminEnable: false,
        crumbEnable: false,
        withoutLeft: false,
    },
    render: (args) => ({
        components: { Breadcrumb },
        setup() {
            return { args };
        },
        template: `
            <Breadcrumb v-bind="args" />
        `,
    }),
};

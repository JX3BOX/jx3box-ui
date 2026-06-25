import User from '@jx3box/jx3box-common/js/user';
import AdminDrop from '../../bread/AdminDrop.vue';
import StoryPropsTable from '../components/StoryPropsTable.vue';
import { mockPost } from '../mockData';

const meta = {
    title: 'Bread/AdminDrop',
    component: AdminDrop,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        isCommunity: { control: 'boolean' },
        showMove: { control: 'boolean' },
        showRobotPic: { control: 'boolean' },
        buttonSize: { control: 'radio', options: ['small', 'default', 'large'] },
        permissions: { control: 'object' },
    },
};

export default meta;

const originalHasPermission = User.hasPermission;
const originalIsEditor = User.isEditor;

function patchUser(permissions) {
    const set = new Set(permissions || []);
    User.hasPermission = (permission) => set.has(permission);
    User.isEditor = () => true;
}

if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        User.hasPermission = originalHasPermission;
        User.isEditor = originalIsEditor;
    });
}

const articlePost = {
    ...mockPost,
    id: mockPost.ID,
};

const communityPost = {
    id: 3001,
    title: '社区主题示例',
    user_id: 8,
};

const allPermissions = ['update_post', 'create_system_message', 'manage_post_move', 'push_banner'];

const BaseRender = (args) => ({
    components: { AdminDrop, StoryPropsTable },
    setup() {
        patchUser(args.permissions);
        return {
            args,
            articlePost,
            communityPost,
            propsInfo: [
                { name: 'isCommunity', type: 'Boolean', default: 'false', description: '是否使用社区管理菜单。' },
                { name: 'showMove', type: 'Boolean', default: 'false', description: '是否展示转移到社区入口。' },
                { name: 'buttonSize', type: 'String', default: '"default"', description: '管理按钮尺寸。' },
                { name: 'post', type: 'Object', default: '{}', description: '文章或社区来源数据。' },
                { name: 'userId', type: 'Number', default: '0', description: '私信目标用户 ID。' },
                { name: 'showRobotPic', type: 'Boolean', default: 'false', description: '是否展示 QQ 机器人刷图入口。' },
            ],
        };
    },
    watch: {
        'args.permissions': {
            handler(value) {
                patchUser(value);
            },
            immediate: true,
        },
    },
    template: `
        <div style="display:grid;gap:24px;padding:32px;background:#f5f7fb;min-height:100vh;">
            <section style="display:grid;gap:18px;border-radius:20px;background:rgba(255,255,255,0.92);padding:24px;box-shadow:0 24px 60px rgba(15,23,42,0.08);">
                <div>
                    <h2 style="margin:0;font-size:28px;color:#0f172a;">AdminDrop</h2>
                    <p style="margin:12px 0 0;color:#475569;line-height:1.8;">详情页右上角管理下拉菜单。Storybook 中已 mock 权限、私信和刷图请求。</p>
                </div>
                <div style="display:flex;align-items:center;gap:16px;">
                    <AdminDrop
                        v-bind="args"
                        :post="args.isCommunity ? communityPost : articlePost"
                        :user-id="8"
                    />
                    <span style="font-size:13px;color:#64748b;">点击管理按钮查看当前权限下的菜单项。</span>
                </div>
            </section>
            <StoryPropsTable title="AdminDrop" description="管理下拉菜单参数说明。" :items="propsInfo" />
        </div>
    `,
});

export const ArticleAllPermissions = {
    args: {
        isCommunity: false,
        showMove: true,
        showRobotPic: true,
        buttonSize: 'default',
        permissions: allPermissions,
    },
    render: BaseRender,
};

export const Community = {
    args: {
        isCommunity: true,
        showMove: false,
        showRobotPic: false,
        buttonSize: 'default',
        permissions: allPermissions,
    },
    render: BaseRender,
};

export const ReadOnly = {
    args: {
        isCommunity: false,
        showMove: false,
        showRobotPic: false,
        buttonSize: 'small',
        permissions: [],
    },
    render: BaseRender,
};

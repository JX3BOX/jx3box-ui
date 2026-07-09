import CommonHeader from '../../CommonHeader.vue';

const meta = {
    title: 'Layout/CommonHeader',
    component: CommonHeader,
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        overlayEnable: { control: 'boolean' },
    },
};

export default meta;

export const Default = {
    args: {
        overlayEnable: false,
    },
    render: (args) => ({
        components: { CommonHeader },
        setup() {
            return { args };
        },
        template: `
            <div style="min-height: 100vh;">
                <CommonHeader v-bind="args" />
                <div style="height: 1600px;"></div>
            </div>
        `,
    }),
};

export const Overlay = {
    args: {
        overlayEnable: true,
    },
    render: Default.render,
};

export const AccountReadyMock = {
    args: {
        overlayEnable: false,
    },
    render: (args) => ({
        components: { CommonHeader },
        setup() {
            const now = Date.now();
            localStorage.setItem('logged_in', 'true');
            localStorage.setItem('created_at', String(now));
            localStorage.setItem('token', 'storybook-token');
            localStorage.setItem('uid', '8');
            localStorage.setItem('group', '1');
            localStorage.setItem('name', 'Storybook用户');
            localStorage.setItem('status', '0');
            localStorage.setItem('token_version', 'storybook');
            localStorage.setItem('avatar', 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png');
            localStorage.removeItem('jx3box:account-ready-dismissed-until:8');
            sessionStorage.removeItem('panel');

            return { args };
        },
        template: `
            <div style="min-height: 100vh; background: #f5f7fb;">
                <CommonHeader v-bind="args" />
                <main style="padding: 96px 32px;">
                    <h1 style="margin: 0 0 12px; font-size: 28px;">公共头账号安全提醒 mock</h1>
                    <p style="margin: 0; color: #666;">当前 mock 用户未绑定邮箱/手机，也未设置密码，公共头会自动弹出提醒。</p>
                </main>
            </div>
        `,
    }),
};

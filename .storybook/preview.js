import { setup } from '@storybook/vue3';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import axios from 'axios';

import { install } from '../index';
import { Jx3boxUiI18n } from '../i18n';
import navData from '../assets/data/nav.json';
import boxData from '../assets/data/box.json';
import StorybookShell from '../src/stories/layout/StorybookShell.vue';
import { resolveAdapter, resolveStorybookMock } from './storybookMocks';

import '@jx3box/jx3box-common/css/normalize.css';
import '@jx3box/jx3box-common/css/font.css';
import 'element-plus/dist/index.css';
import '@jx3box/jx3box-common/css/tailwind.css';

let axiosPatched = false;

function patchAxiosForStorybook() {
    if (axiosPatched) return;

    const originalCreate = axios.create.bind(axios);
    const originalGet = axios.get.bind(axios);

    const withMockAdapter = (instance) => {
        const defaultAdapter = resolveAdapter(axios, instance.defaults.adapter);
        instance.defaults.adapter = async (config) => {
            const mocked = resolveStorybookMock(config);
            if (mocked) return mocked;
            if (defaultAdapter) return defaultAdapter(config);
            throw new Error(`Unmocked request in Storybook: ${config?.url || ''}`);
        };
        return instance;
    };

    axios.create = (...args) => withMockAdapter(originalCreate(...args));
    axios.get = (url, ...args) => {
        const config = { method: 'get', url, ...(args[0] || {}) };
        const mocked = resolveStorybookMock(config);
        if (mocked) {
            return Promise.resolve(mocked);
        }
        return originalGet(url, ...args);
    };

    axiosPatched = true;
}

function bootstrapRuntimeData() {
    try {
        sessionStorage.setItem('nav', JSON.stringify(navData));
        sessionStorage.setItem('box', JSON.stringify(boxData));
    } catch (e) {
        // ignore session storage failures in restricted contexts
    }

    try {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        localStorage.removeItem('group');
        localStorage.removeItem('created_at');
        localStorage.removeItem('name');
        localStorage.removeItem('status');
        localStorage.removeItem('avatar');
    } catch (e) {
        // ignore local storage failures in restricted contexts
    }
}

setup((app) => {
    app.use(Jx3boxUiI18n, { locale: 'zh-CN' });
    app.use(ElementPlus, { locale: zhCn });
    install(app);

    for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(name, component);
    }
});

patchAxiosForStorybook();

export const decorators = [
    (story, context) => {
        bootstrapRuntimeData();

        const storyResult = story();
        const shell = context.parameters?.shell;

        if (!shell?.enabled) {
            return storyResult;
        }

        return {
            components: {
                StorybookShell,
                StoryResult: storyResult,
            },
            setup() {
                return { shell };
            },
            template: `
                <StorybookShell v-bind="shell">
                    <StoryResult />
                </StorybookShell>
            `,
        };
    },
];

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/i,
        },
    },
    layout: 'fullscreen',
};

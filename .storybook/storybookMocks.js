import {
    mockBoxcoinConfig,
    mockBoxcoinRecords,
    mockCollection,
    mockCommentPage,
    mockCommentPower,
    mockCreators,
    mockHonor,
    mockMedals,
    mockSearchUser,
    mockTeams,
    mockUserInfo,
    mockUserPosts,
} from '../src/stories/mockData';

function resolveAdapter(axiosModule, adapter) {
    if (!adapter) return null;
    if (typeof adapter === 'function') return adapter;
    if (typeof axiosModule?.getAdapter === 'function') {
        return axiosModule.getAdapter(adapter);
    }
    return null;
}

function normalizePath(config) {
    const rawUrl = config?.url || '';
    const baseURL = config?.baseURL || '';
    const base = baseURL
        ? new URL(baseURL, 'https://storybook.local').toString()
        : 'https://storybook.local';
    const url = rawUrl.startsWith('http') ? new URL(rawUrl) : new URL(rawUrl || '/', base);
    return url.pathname.replace(/^\/__proxy\/[^/]+/, '');
}

function respond(config, data, status = 200) {
    return {
        data,
        status,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
    };
}

function mockCmsConfig(key) {
    if (key === 'boxcoin') return { val: 1 };
    if (key === 'admin_boxcoin_visible') return { val: 1 };
    if (key === 'level_has_gift_permission') return { val: 0 };
    if (key === 'comment_strict') return { val: 0 };
    return { val: '' };
}

export function resolveStorybookMock(config) {
    const method = String(config?.method || 'get').toLowerCase();
    const path = normalizePath(config);
    const params = config?.params || {};

    if (path.includes('/config/global.json')) {
        return respond(config, { token_version: 'storybook' });
    }

    if (method === 'get' && path === '/api/cms/config') {
        return respond(config, { data: mockCmsConfig(params.key) });
    }

    if (method === 'get' && path.match(/^\/api\/cms\/post\/\d+\/authors$/)) {
        return respond(config, { data: mockCreators });
    }

    if (method === 'get' && path.match(/^\/api\/cms\/post\/collection\/\d+$/)) {
        return respond(config, { data: mockCollection });
    }

    if (method === 'get' && path.match(/^\/api\/cms\/user\/\d+\/info$/)) {
        return respond(config, { data: mockUserInfo });
    }

    if (method === 'get' && path.match(/^\/api\/cms\/user\/honor\/\d+\/using$/)) {
        return respond(config, { data: mockHonor });
    }

    if (method === 'get' && path === '/api/cms/user/search') {
        return respond(config, { data: mockSearchUser });
    }

    if (method === 'get' && path.match(/^\/api\/cms\/posts\/user\/\d+\/latest$/)) {
        return respond(config, { data: { list: mockUserPosts } });
    }

    if (method === 'get' && path === '/api/cms/user/decoration') {
        return respond(config, { data: [] });
    }

    if (method === 'get' && path === '/api/cms/account/permission/i') {
        return respond(config, { data: { permission: [{ action: 'manage_boxcoin_bbs' }] } });
    }

    if (method === 'get' && path.match(/^\/api\/next2\/user\/\d+\/medals$/)) {
        return respond(config, { data: mockMedals });
    }

    if (method === 'get' && path === '/api/team/relation/public') {
        return respond(config, { data: mockTeams });
    }

    if (method === 'get' && path.match(/^\/api\/next2\/rss\/overview\/author\/\d+$/)) {
        return respond(config, { data: { total: 128, subscribed: false } });
    }

    if (method === 'get' && path.match(/^\/api\/inspire\/article\/.+\/boxcoin\/limit$/)) {
        return respond(config, { data: mockBoxcoinConfig });
    }

    if (method === 'get' && path.match(/^\/api\/inspire\/article\/.+\/history$/)) {
        return respond(config, { data: mockBoxcoinRecords });
    }

    if (method === 'get' && path.match(/^\/api\/next2\/comment\/.+\/i-am-author$/)) {
        return respond(config, mockCommentPower);
    }

    if (method === 'get' && path.match(/^\/api\/next2\/comment\/.+\/comment\/page\/\d+$/)) {
        return respond(config, mockCommentPage);
    }

    if (method === 'get' && path.match(/^\/api\/next2\/comment\/.+\/comment\/\d+\/reply\/page\/\d+$/)) {
        return respond(config, mockCommentPage);
    }

    if (['post', 'put', 'delete'].includes(method) && path.startsWith('/api/next2/comment/')) {
        return respond(config, { code: 0, data: {} });
    }

    if (['post', 'delete'].includes(method) && path.startsWith('/api/next2/rss/')) {
        return respond(config, { code: 0, data: { subscribed: method === 'post' } });
    }

    if (['post', 'delete', 'get'].includes(method) && path.startsWith('/api/article/favorites/')) {
        return respond(config, { code: 0, data: { id: 1, totalFavorites: 12 } });
    }

    if (method === 'get' && path === '/api/vip/i') {
        return respond(config, {
            data: {
                was_vip: 0,
                expire_date: '1970-02-02T16:00:00.000Z',
                total_day: 0,
                was_pro: 0,
                pro_expire_date: '1970-02-02T16:00:00.000Z',
                pro_total_day: 0,
                rename_card_count: 0,
                had_renamed: 0,
                namespace_card_count: 0,
                box_coin: 300,
                points: 16800,
                experience: 16800,
            },
        });
    }

    if (method === 'post' && path === '/api/next2/userdata/watch-later/item') {
        return respond(config, { code: 0, data: {} });
    }

    return null;
}

export { resolveAdapter };

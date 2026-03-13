export const mockPost = {
    ID: 80449,
    post_title: '轻剑驭风版本攻略示例',
    post_type: 'bbs',
    post_author: 8,
    author_info: {
        display_name: '薄嘴唇靓仔',
    },
    post_status: 'publish',
    visible: 0,
    original: 1,
    client: 'std',
    is_wujie: 1,
    post_date: '2026-03-10T10:00:00+08:00',
    post_modified: '2026-03-10T12:00:00+08:00',
    post_collection: 1,
    collection_collapse: true,
    _check: true,
    comment: 0,
    anonymous: 0,
    post_content: `
        <h2>版本概览</h2>
        <p>这是用于 Storybook 展示的示例内容，方便在组件协作时快速查看正文渲染、目录和互动区域。</p>
        <h3>核心思路</h3>
        <p>以稳定输出和阅读体验为主，保留标题、段落、列表和分隔块。</p>
        <ul>
            <li>技能循环以稳定为主</li>
            <li>装备搭配偏泛用场景</li>
            <li>正文支持目录生成与分页渲染</li>
        </ul>
        <h3>配装建议</h3>
        <p>优先保证命中与会心，其次根据副本环境调整破防与加速。</p>
    `,
};

export const mockStat = {
    views: 24567,
};

export const mockCollection = {
    title: '轻剑驭风小册',
    posts: [
        { id: 80449, type: 'bbs', title: '轻剑驭风版本攻略示例' },
        { id: 80450, type: 'bbs', title: '配装与输出循环拆解' },
        { id: 80451, type: 'custom', title: '团队实战思路补充', url: 'https://www.jx3box.com' },
    ],
};

export const mockCreators = {
    super_author: {
        ID: 8,
        display_name: '薄嘴唇靓仔',
        user_avatar: 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png',
    },
    other_authors: [
        {
            author_id: 17,
            label: '校对',
            status: 1,
            post_author_info: {
                ID: 17,
                display_name: '藏剑校对君',
                user_avatar: 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png',
            },
        },
        {
            author_id: 26,
            label: '补充说明',
            status: 1,
            post_author_info: {
                ID: 26,
                display_name: '副本小助手',
                user_avatar: 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png',
            },
        },
    ],
};

export const mockUserInfo = {
    id: 8,
    ID: 8,
    display_name: '薄嘴唇靓仔',
    user_avatar: 'https://cdn.jx3box.com/upload/avatar/2022/3/2/8_9860765.png',
    user_avatar_frame: 'gold',
    user_bio: '擅长版本攻略与机制拆解，长期更新实战内容。',
    experience: 16800,
    is_pro: true,
    is_pre: false,
    sign: true,
    user_nickname: '薄嘴唇靓仔',
    weibo_name: 'jx3box-demo',
    weibo_id: 'jx3box-demo',
    github_name: 'JX3BOX',
    tv_type: 'bilibili',
    tv_id: '2066064028',
};

export const mockHonor = {
    ranking: 1,
    year: '2025',
    val: 'storybook_honor',
    honor_info: {
        url: '/rank/1',
        only: false,
        prefix: '年度',
        ranking: [[1, 10, '金榜']],
        suffix: '作者',
        color: '#ffffff',
        img: 'default',
        img_ext: 'png',
    },
};

export const mockUserPosts = [
    { ID: 80449, post_type: 'bbs', post_title: '轻剑驭风版本攻略示例' },
    { ID: 80450, post_type: 'bbs', post_title: '配装与输出循环拆解' },
    { ID: 80451, post_type: 'bbs', post_title: '副本环境适配建议' },
];

export const mockMedals = [
    { id: 1, medal: 'storyboard-star', medal_desc: '年度创作者', medal_url: '/medal/1' },
    { id: 2, medal: 'storyboard-ace', medal_desc: '高质量攻略作者', medal_url: '/medal/2' },
];

export const mockTeams = [
    {
        team_id: 1001,
        team_name: '诗画印象',
        team_server: '蝶恋花',
        team_logo: 'https://cdn.jx3box.com/image/team/logo.png',
    },
];

export const mockCommentPower = {
    allow: true,
    uid: 8,
    is_author: 1,
    is_editor: 1,
    is_white: false,
    article_open_white: 1,
    can_del: true,
};

export const mockCommentPage = {
    data: [
        {
            id: 9001,
            userId: 8,
            displayName: '薄嘴唇靓仔',
            avatar: mockUserInfo.user_avatar,
            user_avatar_frame: '',
            commentDate: '2026-03-10 12:00',
            content: '<p>这套 story 的目的是让组件在 Storybook 里有完整上下文，不再只看单个孤立节点。</p>',
            attachments: '[]',
            likes: 12,
            is_likes: 0,
            is_top: 1,
            is_star: 1,
            is_secret: 0,
            is_white: 1,
            reply: [
                {
                    id: 9101,
                    userId: 17,
                    displayName: '藏剑校对君',
                    avatar: mockCreators.other_authors[0].post_author_info.user_avatar,
                    user_avatar_frame: '',
                    commentDate: '2026-03-10 12:10',
                    content: '<p>目录、正文、评论和互动区已经能在同一个画面里联动查看了。</p>',
                    attachments: '[]',
                    likes: 3,
                    is_likes: 0,
                    is_top: 0,
                    is_star: 0,
                    is_secret: 0,
                    is_white: 0,
                },
            ],
        },
    ],
    page: {
        index: 1,
        pageSize: 10,
        pageTotal: 1,
        total: 1,
    },
};

export const mockBoxcoinConfig = {
    limit: {
        admin_max: 1000,
        admin_min: 10,
        admin_points: [10, 50, 100, 500],
        user_points: [10, 20, 50, 100],
        total_limit: 10000,
    },
    asManagerBoxCoinRemain: 4800,
    asManagerBoxCoinTotal: 10000,
    asPostTypeBoxcoinHasUsedTotalAtCurrentYear: 1200,
    asUserBoxCoinRemainAll: 300,
    asUserBoxCoinRemainStd: 500,
    asUserBoxCoinRemainOrigin: 120,
};

export const mockBoxcoinRecords = {
    data: [
        {
            id: 1,
            operate_user_id: 17,
            user_id: 8,
            count: 50,
            ext_take_off_count: 0,
            ext2_take_off_count: 0,
            is_user_gift: 1,
            remark: '感谢持续更新，内容很有帮助。',
            created_at: '2026-03-10 12:20',
            ext_operate_user_info: {
                id: 17,
                avatar: mockUserInfo.user_avatar,
                display_name: '盒友甲',
            },
            ext_user_info: {
                avatar: mockUserInfo.user_avatar,
                display_name: mockUserInfo.display_name,
            },
        },
    ],
    page: {
        total: 1,
    },
    fromManager: 0,
    fromUser: 50,
};

export const mockSearchUser = {
    ID: 8,
    display_name: '薄嘴唇靓仔',
    user_avatar: mockUserInfo.user_avatar,
};

export const mockCommitHistories = [
    {
        id: 301,
        commit_hash: 'story-hash-003',
        created_at: '2026-03-10 18:30',
        content: `
            <h2>版本概览</h2>
            <p>第三版补充了实战环境下的起手建议，并优化了小药说明。</p>
            <h3>核心思路</h3>
            <p>优先确保循环稳定，再根据副本站位调整爆发时机。</p>
        `,
    },
    {
        id: 302,
        commit_hash: 'story-hash-002',
        created_at: '2026-03-09 21:10',
        content: `
            <h2>版本概览</h2>
            <p>第二版补充了配装对比表，并调整了目录结构。</p>
            <h3>核心思路</h3>
            <p>兼顾命中与会心，在多数副本环境里更易复用。</p>
        `,
    },
    {
        id: 303,
        commit_hash: 'story-hash-001',
        created_at: '2026-03-08 15:00',
        content: `
            <h2>版本概览</h2>
            <p>初版主要建立正文结构，包含配装建议与循环说明。</p>
            <h3>核心思路</h3>
            <p>先保证阅读完整度，再逐步补足细节。</p>
        `,
    },
];

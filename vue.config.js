const path = require("path");

let commonDomains = {};
try {
    // 与 @jx3box/jx3box-common/js/api.js 的默认域名兜底保持一致
    commonDomains = require("@jx3box/jx3box-common/data/jx3box.json");
} catch (e) {
    commonDomains = {};
}

function normalizeTarget(value) {
    if (!value) return "";
    const trimmed = String(value).trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed.replace(/^\/+/, "")}`;
}

function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildEnvProxy() {
    const nodeEnv = String(process.env.NODE_ENV || "").toLowerCase();
    if (nodeEnv && nodeEnv !== "development") return {};

    // Vue CLI 加载 .env 的时机/覆盖关系可能导致这里读不到或读到意外值：
    // - 明确设置为 false 才禁用
    // - 未设置/无法读取时，仍然生成代理（仅在 devServer 生效）
    const rawEnabled = String(process.env.VUE_APP_PROXY_ENABLE || "").toLowerCase();
    const disabled = ["0", "false", "no", "off"].includes(rawEnabled);
    if (disabled) return {};

    const prefix = process.env.VUE_APP_PROXY_PREFIX || "/__proxy";
    const mk = (serviceKey, target) => {
        const normalized = normalizeTarget(target);
        if (!normalized) return {};
        const context = `${prefix}/${serviceKey}`;
        const contextRe = new RegExp(`^${escapeRegExp(context)}`);
        return {
            [context]: {
                target: normalized,
                changeOrigin: true,
                secure: false,
                cookieDomainRewrite: "",
                pathRewrite: (p) => p.replace(contextRe, ""),
            },
        };
    };

    const serviceTargets = {
        cms: process.env.VUE_APP_CMS_API || commonDomains.__cms,
        next: process.env.VUE_APP_NEXT_API || commonDomains.__next,
        team: process.env.VUE_APP_TEAM_API || commonDomains.__team,
        pay: process.env.VUE_APP_PAY_API || commonDomains.__pay,
        lua: process.env.VUE_APP_LUA_API || commonDomains.__lua,
        node: process.env.VUE_APP_NODE_API || commonDomains.__node,
        helper: process.env.VUE_APP_HELPER_API || commonDomains.__helperUrl,
    };

    return Object.keys(serviceTargets).reduce((acc, key) => Object.assign(acc, mk(key, serviceTargets[key])), {});
}

module.exports = {
    //❤️ define path for static files ~
    publicPath: process.env.NODE_ENV === "development" ? "/" : process.env.STATIC_PATH,

    // 依赖包（element-plus/theme-chalk 等）会输出大量 Sass deprecation 警告
    // 这些不是运行错误，开启 quietDeps 让它们不刷屏（只保留项目自身的警告）
    css: {
        loaderOptions: {
            sass: {
                sassOptions: {
                    quietDeps: true,
                },
            },
            scss: {
                sassOptions: {
                    quietDeps: true,
                },
            },
        },
    },

    // 过滤依赖包里的已知兼容性 warning（不影响运行，但会刷屏）
    configureWebpack: {
        stats: {
            warningsFilter: [/node_modules[\\\\/]+@jx3box[\\\\/]+jx3box-common[\\\\/]+/],
        },
    },

    pages: {
        index: {
            entry: "src/main.js",
            template: "public/index.html",
            filename: "index.html",
            title: "JX3BOX",
        },
        article: {
            title: "Article",
            entry: "demo/A.js",
            template: "public/article.html",
            filename: "article/index.html",
        },
        tinymce: {
            title: "Tinymce",
            entry: "demo/T.js",
            template: "public/tinymce.html",
            filename: "tinymce/index.html",
        },
    },


    //⚛️ Proxy ~
    devServer: {
        host: "localhost",
        // 与 @jx3box/jx3box-common/js/api.js 对齐：
        // 本地开发开启 `VUE_APP_PROXY_ENABLE=1` 后，会把请求 baseURL 切到 `${VUE_APP_PROXY_PREFIX}/${serviceKey}`
        proxy: buildEnvProxy(),
        allowedHosts: "all",
        port: process.env.VUE_PORT || 12028,
    },

    //❤️ Webpack configuration
    chainWebpack: (config) => {
        //💘 html-webpack-plugin ~
        // Multiple pages disable the block below
        // config.plugin("html").tap((args) => {
        //     args[0].meta = {
        //         //------设置SEO信息
        //         Keywords: setting.keys,
        //         Description: setting.desc,
        //     };
        //     args[0].title = setting.title; //------自动添加标题后缀
        //     return args;
        // });

        //💝 in-line small imgs ~
        config.module.rule("images").set("parser", {
            dataUrlCondition: {
                maxSize: 4 * 1024, // 4KiB
            },
        });

        //💝 in-line svg imgs ~
        config.module.rule("vue").use("vue-svg-inline-loader").loader("vue-svg-inline-loader");

        //💖 import common less var * mixin ~
        const types = ["vue-modules", "vue", "normal-modules", "normal"];
        types.forEach((type) => addStyleResource(config.module.rule("less").oneOf(type)));

        config.externals = {
            tinyMCE: "tinyMCE",
        }
    },
};

function addStyleResource(rule) {
    var preload_styles = [];
    preload_styles.push(
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/var.less"),
        path.resolve(__dirname, "./node_modules/@jx3box/jx3box-common/css/mixin.less"),
        path.resolve(__dirname, "./assets/css/var.less"),
        path.resolve(__dirname, "./assets/css/mixin.less"),
        path.resolve(__dirname, "./node_modules/csslab/base.less"),
    );
    rule.use("style-resource").loader("style-resources-loader").options({
        patterns: preload_styles,
    });
}

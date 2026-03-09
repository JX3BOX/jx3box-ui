const path = require('path');

const lessResourcePatterns = [
    path.resolve(__dirname, '../node_modules/@jx3box/jx3box-common/css/var.less'),
    path.resolve(__dirname, '../node_modules/@jx3box/jx3box-common/css/mixin.less'),
    path.resolve(__dirname, '../assets/css/var.less'),
    path.resolve(__dirname, '../assets/css/mixin.less'),
    path.resolve(__dirname, '../node_modules/csslab/base.less'),
];

function walkRules(rules, visitor) {
    if (!Array.isArray(rules)) return;
    rules.forEach((rule) => {
        visitor(rule);
        if (Array.isArray(rule.oneOf)) walkRules(rule.oneOf, visitor);
        if (Array.isArray(rule.rules)) walkRules(rule.rules, visitor);
    });
}

function ensureVueSvgInlineLoader(config) {
    walkRules(config.module?.rules, (rule) => {
        if (!Array.isArray(rule.use)) return;

        const hasVueLoader = rule.use.some((use) => {
            const loader = typeof use === 'string' ? use : use?.loader;
            return loader && loader.includes('vue-loader');
        });

        if (!hasVueLoader) return;

        const hasSvgInlineLoader = rule.use.some((use) => {
            const loader = typeof use === 'string' ? use : use?.loader;
            return loader && loader.includes('vue-svg-inline-loader');
        });

        if (!hasSvgInlineLoader) {
            rule.use.push({
                loader: require.resolve('vue-svg-inline-loader'),
            });
        }
    });
}

function ensureLessGlobalResources(config) {
    walkRules(config.module?.rules, (rule) => {
        if (!Array.isArray(rule.use)) return;

        for (let i = 0; i < rule.use.length; i += 1) {
            const currentUse = rule.use[i];
            const loader = typeof currentUse === 'string' ? currentUse : currentUse?.loader;

            if (!loader || !loader.includes('less-loader')) continue;

            const hasStyleResource = rule.use.some((use) => {
                const useLoader = typeof use === 'string' ? use : use?.loader;
                return useLoader && useLoader.includes('style-resources-loader');
            });

            if (!hasStyleResource) {
                rule.use.splice(i + 1, 0, {
                    loader: require.resolve('style-resources-loader'),
                    options: {
                        patterns: lessResourcePatterns,
                    },
                });
            }

            break;
        }
    });
}

function removeVueDocgenLoader(config) {
    walkRules(config.module?.rules, (rule) => {
        const directLoader = typeof rule.loader === 'string' ? rule.loader : '';
        if (directLoader.includes('vue-docgen-loader')) {
            rule.__remove = true;
            return;
        }

        if (!Array.isArray(rule.use)) return;
        rule.use = rule.use.filter((use) => {
            const loader = typeof use === 'string' ? use : use?.loader;
            return !(loader && loader.includes('vue-docgen-loader'));
        });
    });

    if (Array.isArray(config.module?.rules)) {
        config.module.rules = config.module.rules.filter((rule) => !rule.__remove);
    }
}

function ensureStyleRules(config) {
    const rules = config.module?.rules || [];
    const hasLessRule = rules.some((rule) => String(rule.test).includes('less'));
    const hasScssRule = rules.some((rule) => String(rule.test).includes('scss'));
    const hasCssRule = rules.some((rule) => String(rule.test).includes('\\.css$'));

    if (hasCssRule) {
        walkRules(rules, (rule) => {
            if (!String(rule.test).includes('\\.css$') || !Array.isArray(rule.use)) return;
            const hasPostcss = rule.use.some((use) => {
                const loader = typeof use === 'string' ? use : use?.loader;
                return loader && loader.includes('postcss-loader');
            });
            if (!hasPostcss) {
                rule.use.push({
                    loader: require.resolve('postcss-loader'),
                    options: {
                        postcssOptions: {
                            config: path.resolve(__dirname, '../postcss.config.js'),
                        },
                    },
                });
            }
        });
    }

    if (!hasLessRule) {
        rules.push({
            test: /\.less$/i,
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: { importLoaders: 1 },
                },
                {
                    loader: require.resolve('postcss-loader'),
                    options: {
                        postcssOptions: {
                            config: path.resolve(__dirname, '../postcss.config.js'),
                        },
                    },
                },
                {
                    loader: require.resolve('less-loader'),
                    options: {
                        lessOptions: {
                            javascriptEnabled: true,
                        },
                    },
                },
                {
                    loader: require.resolve('style-resources-loader'),
                    options: {
                        patterns: lessResourcePatterns,
                    },
                },
            ],
        });
    }

    if (!hasScssRule) {
        rules.push({
            test: /\.s[ac]ss$/i,
            use: [
                require.resolve('style-loader'),
                require.resolve('css-loader'),
                {
                    loader: require.resolve('postcss-loader'),
                    options: {
                        postcssOptions: {
                            config: path.resolve(__dirname, '../postcss.config.js'),
                        },
                    },
                },
                require.resolve('sass-loader'),
            ],
        });
    }

    config.module.rules = rules;
}

/** @type { import('@storybook/vue3-webpack5').StorybookConfig } */
module.exports = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
    addons: [
        {
            name: '@storybook/addon-essentials',
            options: {
                docs: false,
            },
        },
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/vue3-webpack5',
        options: {
            docgen: false,
        },
    },
    webpackFinal: async (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            '@': path.resolve(__dirname, '../src'),
        };

        removeVueDocgenLoader(config);
        ensureStyleRules(config);
        ensureVueSvgInlineLoader(config);
        ensureLessGlobalResources(config);

        return config;
    },
};

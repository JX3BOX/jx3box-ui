const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Vue = require('vue');
const { parse } = require('@vue/compiler-sfc');
const { compile } = require('@vue/compiler-dom');
const { renderToString } = require('@vue/server-renderer');

function loadViewer() {
    const source = fs.readFileSync(require.resolve('../src/wiki/ResponsiveCodeDiff.vue'), 'utf8');
    const { descriptor } = parse(source);
    const CodeDiff = {
        props: ['oldString', 'newString', 'outputFormat', 'hideHeader'],
        render() {
            return Vue.h('pre', { 'data-format': this.outputFormat, 'data-hidden-header': this.hideHeader }, this.oldString + '|' + this.newString);
        },
    };
    const component = new Function('CodeDiff', descriptor.script.content.replace(/^import .*;$/gm, '').replace('export default', 'return'))(CodeDiff);
    component.render = new Function('Vue', compile(descriptor.template.content, { mode: 'function' }).code)(Vue);
    return component;
}

test('手机端两个独立版本容器保留原始对比数据，桌面端只渲染一组左右对比', async () => {
    for (const mobile of [true, false]) {
        const component = loadViewer();
        component.data = () => ({ isMobile: mobile });
        const html = await renderToString(Vue.createSSRApp(component, {
            oldString: 'old <p>内容</p>', newString: 'new 内容', filename: 'v2 长说明', newFilename: 'v3 长说明',
        }));
        assert.equal((html.match(/<pre/g) || []).length, mobile ? 2 : 1);
        assert.equal((html.match(/data-format="side-by-side"/g) || []).length, mobile ? 2 : 1);
        if (mobile) {
            assert.match(html, /is-old/);
            assert.match(html, /is-new/);
            assert.match(html, /<h3>v2 长说明<\/h3>/);
            assert.match(html, /<h3>v3 长说明<\/h3>/);
        }
        assert.match(html, /old &lt;p&gt;内容&lt;\/p&gt;\|new 内容/);
    }
});

test('屏幕宽度变化更新布局，卸载时移除监听', () => {
    const component = loadViewer();
    const previousWindow = global.window;
    let handler;
    let removed = false;
    const query = { matches: true, addEventListener(name, fn) { assert.equal(name, 'change'); handler = fn; }, removeEventListener(name, fn) { removed = name === 'change' && fn === handler; } };
    global.window = { matchMedia: () => query };
    try {
        const context = { isMobile: false, updateLayout: component.methods.updateLayout };
        component.mounted.call(context);
        assert.equal(context.isMobile, true);
        handler.call(context, { matches: false });
        assert.equal(context.isMobile, false);
        component.beforeUnmount.call(context);
        assert.equal(removed, true);
    } finally {
        if (previousWindow === undefined) delete global.window;
        else global.window = previousWindow;
    }
});

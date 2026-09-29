const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../src/header/box-menu.js'), 'utf8')
    .replace(/^import .+;$/gm, '').replace(/export function /g, 'function ');
const { findBoxMenuLink } = Function(source + ';return {findBoxMenuLink};')();
const menu = [
    {label: '技能合集', abbr: '招式', href: '/bps/kungfu', client: ['std', 'origin']},
    {label: '技改历史', abbr: 'PVE技改', href: '/bps/changelog'},
    {label: '技改历史', abbr: 'PVP技改', href: '/pvp/changelog'},
    {label: '万宝楼', abbr: '万宝楼', href: '/std', client: 'std'},
    {label: '万宝楼', abbr: '万宝楼', href: '/origin', client: ['origin']},
    {label: '隐藏入口', abbr: '隐藏', href: '/hidden', status: false},
];
test('full names and abbreviations match, including case and whitespace', () => {
    assert.equal(findBoxMenuLink(menu, '技能合集'), '/bps/kungfu');
    assert.equal(findBoxMenuLink(menu, '招式'), '/bps/kungfu');
    assert.equal(findBoxMenuLink(menu, ' pve技改 '), '/bps/changelog');
    assert.equal(findBoxMenuLink(menu, 'PVP技改'), '/pvp/changelog');
});
test('client filtering disambiguates links and ambiguous or hidden names do not redirect', () => {
    assert.equal(findBoxMenuLink(menu, '万宝楼', 'std'), '/std');
    assert.equal(findBoxMenuLink(menu, '万宝楼', 'origin'), '/origin');
    for (const query of ['技改历史', '隐藏', '', '技', '攻略内容']) {
        assert.equal(findBoxMenuLink(menu, query), null);
    }
});
test('search keeps numeric, legacy keyword and ordinary search behavior', () => {
    const utils = fs.readFileSync(path.join(__dirname, '../src/header/utils.js'), 'utf8')
        .replace(/^import .+;$/gm, '').replace(/export function /g, 'function ');
    const opened = [];
    const forms = [];
    const document = {
        createElement: () => ({ children: [], appendChild(child) { this.children.push(child); }, submit() { forms.push(this); } }),
        body: { appendChild() {}, removeChild() {} },
    };
    const searchJump = Function('JX3BOX', 'findBoxMenuLink', 'searchMap', 'window', 'document', utils + ';return searchJump;')(
        {__Root: 'https://www.jx3box.com/'}, findBoxMenuLink, {'qq机器人': '/qqbot'},
        {open: (url) => opened.push(url)}, document
    );
    const run = (searchValue) => searchJump({searchValue, menu, url: '/search', client: 'std'});
    run('招式'); run('123'); run('qq机器人'); run('攻略内容');
    assert.deepEqual(opened, ['/bps/kungfu', 'https://www.jx3box.com/post/123', '/qqbot']);
    assert.equal(forms[0].action, '/search');
    assert.deepEqual(forms[0].children.map(({name, value}) => [name, value]), [['q', '攻略内容'], ['client', 'std']]);
});

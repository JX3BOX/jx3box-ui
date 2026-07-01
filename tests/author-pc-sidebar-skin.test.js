const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const service = fs.readFileSync(path.join(root, "service/cms.js"), "utf8");
const author = fs.readFileSync(path.join(root, "src/single/Author.vue"), "utf8");
const authorInfo = fs.readFileSync(path.join(root, "src/author/AuthorInfo.vue"), "utf8");
const authorStyle = fs.readFileSync(path.join(root, "assets/css/single/author.less"), "utf8");

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

assert(service.includes("/api/cms/user/skin"), "user skin service should request the active skin endpoint");

assert(author.includes("getUserSkin"), "Author wrapper should request user skin data directly");

assert(!authorInfo.includes("getUserSkin"), "AuthorInfo should not request user skin data");

assert(author.includes('item.subtype === "pc_sidebar"'), "Author should consume the pc_sidebar skin part");

assert(author.includes("record.skins"), "Author should resolve active skin resources from skins[]");

assert(author.includes("backgroundPosition: this.sidebarSkinPosition"), "Author should apply skin position");

assert(author.includes('rt: "right top"'), "Author should map rt to right top");

assert(authorStyle.includes("background-repeat: no-repeat"), "Author skin background should not repeat");

assert(authorStyle.includes("background-size: 100% auto"), "Author skin background should use full width and auto height");

console.log("author pc sidebar skin checks passed");

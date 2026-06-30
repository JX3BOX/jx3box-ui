const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const service = fs.readFileSync(path.join(root, "service/cms.js"), "utf8");
const component = fs.readFileSync(path.join(root, "src/comment/CommentWithReply.vue"), "utf8");
const leftSidebar = fs.readFileSync(path.join(root, "src/LeftSidebar.vue"), "utf8");
const app = fs.readFileSync(path.join(root, "src/App.vue"), "utf8");

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

assert(service.includes("/api/cms/user/decoration/v2"), "getDecoration should support the decoration v2 endpoint");

assert(component.includes("getDecorationV2"), "comment decoration should request the v2 decoration endpoint");

assert(component.includes('subtype: "pc_comment"'), "comment decoration should request the pc_comment subtype");

assert(component.includes("resolveDecorationDetail"), "comment decoration should resolve v2 decorations payload");

assert(component.includes("normalizeDecorationImage"), "comment decoration should normalize returned image URLs");

assert(
    !component.includes("decoration/images/${decoration.val}/comment.png"),
    "comment decoration should not depend on the old val/comment.png path"
);

assert(
    !/\bdecoration\.decoration\b/.test(component),
    "comment decoration should not support legacy decoration payloads"
);

assert(!component.includes("markdownMatch"), "comment decoration should not support markdown-link compatibility");

assert(!component.includes("decoration.image"), "comment decoration should not fall back to legacy top-level image");

assert(leftSidebar.includes("getDecorationV2"), "left sidebar decoration should request the v2 decoration endpoint");

assert(leftSidebar.includes('subtype: "pc_sidebar"'), "left sidebar decoration should request the pc_sidebar subtype");

assert(leftSidebar.includes("resolveDecorationDetail"), "left sidebar decoration should resolve v2 decorations payload");

assert(
    !leftSidebar.includes("design/decoration/images/${val}/${type}.png"),
    "left sidebar decoration should not depend on the old val/sidebar.png path"
);

assert(
    app.includes('<LeftSidebar :open="true" :uid="8719">') && app.includes('<Author :uid="8719" />'),
    "local author fixture should pass the same 8719 uid to LeftSidebar and Author"
);

console.log("decoration v2 checks passed");

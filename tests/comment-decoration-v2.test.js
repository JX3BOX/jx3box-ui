const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const service = fs.readFileSync(path.join(root, "service/cms.js"), "utf8");
const commentList = fs.readFileSync(path.join(root, "src/single/Comment.vue"), "utf8");
const component = fs.readFileSync(path.join(root, "src/comment/CommentWithReply.vue"), "utf8");
const leftSidebar = fs.readFileSync(path.join(root, "src/LeftSidebar.vue"), "utf8");

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

assert(service.includes("/api/cms/user/decoration/v2"), "getDecoration should support the decoration v2 endpoint");

assert(service.includes("/api/cms/user/skin/batch"), "comment skin should support the batch user skin endpoint");

assert(commentList.includes("getUserSkinBatch"), "comment list should request user skins in batch");

assert(commentList.includes('type: COMMENT_SKIN_TYPE'), "comment skin request should include the comment type");

assert(commentList.includes('subtype: COMMENT_SKIN_SUBTYPE'), "comment skin request should include the pc_comment subtype");

assert(commentList.includes(":skin=\"commentSkins[item.userId]\""), "comment list should pass per-user skin to items");

assert(!component.includes("getDecorationV2"), "comment item should not request the legacy decoration v2 endpoint");

assert(component.includes("skin:"), "comment item should accept a skin prop");

assert(!component.includes("resolveDecorationDetail"), "comment item should not resolve legacy v2 decorations payload");

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

console.log("decoration v2 checks passed");

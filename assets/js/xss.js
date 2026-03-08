import sanitizeHtml from "sanitize-html";
import * as cheerio from "cheerio";
import postcss from "postcss";
import safeParser from "postcss-safe-parser";

const FORBID = new Set(["script", "object", "embed", "applet", "base", "meta", "link"]);

const EXTRA_TAGS = [
    "img",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "table", "thead", "tbody", "tr", "th", "td",
    "blockquote", "pre", "code", "hr",
    "video", "source",
    "iframe", "style",
    "colgroup", "col",
];

// 必须顶层的 at-rule（你说不需要动画，但 keyframes 也可能被编辑器/作者写进来，留着更稳）
const TOP_LEVEL_AT = new Set(["keyframes", "-webkit-keyframes", "font-face"]);

function stripDangerousCss(css) {
    if (!css) return css;
    return css
        .replace(/@import\s+[^;]+;?/gi, "")
        .replace(/url\s*\(\s*[^)]+\s*\)/gi, "")
        .replace(/expression\s*\([^)]*\)/gi, "");
}

// 暴力把 style 内容 nest 到 .c-article
function nestCssBrutally(cssText, scope = ".c-article") {
    let css = stripDangerousCss(cssText || "");
    if (!css.trim()) return css;

    const root = postcss.parse(css, { parser: safeParser });

    const top = [];
    const rest = [];

    (root.nodes || []).forEach((node) => {
        if (node.type === "atrule" && TOP_LEVEL_AT.has(String(node.name).toLowerCase())) {
            top.push(node.toString());
        } else {
            rest.push(node.toString());
        }
    });

    const restCss = rest.join("\n").trim();
    if (!restCss) return top.join("\n").trim();

    return `${top.join("\n")}\n${scope}{\n${restCss}\n}`.trim();
}

function nestAllStyleTags(html, scope = ".c-article") {
    const $ = cheerio.load(html, { decodeEntities: false });

    $("style").each((_, el) => {
        const oldCss = $(el).html() || "";
        const newCss = nestCssBrutally(oldCss, scope);
        $(el).text(newCss);
    });

    return $.html();
}

export default function sanitizeRichText(html) {
    if (!html) return html;

    // 先把 <style> 内容暴力 nest 到 .c-article
    html = nestAllStyleTags(html, ".c-article");

    const allowedTags = sanitizeHtml.defaults.allowedTags
        .concat(EXTRA_TAGS)
        .filter((t, i, arr) => arr.indexOf(t) === i)
        .filter((t) => !FORBID.has(t));

    return sanitizeHtml(html, {
        disallowedTagsMode: "discard",
        allowedTags,

        allowedAttributes: {
            "*": ["class", "style", "title", "id", "data-*"],
            a: ["href", "target", "rel", "title", "class", "style"],
            img: ["src", "alt", "title", "width", "height", "class", "style", "loading", "decoding"],
            video: ["controls", "width", "height", "class", "style"],
            source: ["src", "type"],
            iframe: ["src", "width", "height", "frameborder", "scrolling", "allowfullscreen", "sandbox", "referrerpolicy", "class", "style"],
            td: ["colspan", "rowspan", "align", "valign", "class", "style"],
            th: ["colspan", "rowspan", "align", "valign", "class", "style"],
            col: ["span", "width", "class", "style"],
            style: ["type", "media"],
        },

        allowedSchemes: ["http", "https", "mailto", "tel"],
        allowProtocolRelative: true,
        allowedSchemesByTag: { img: ["http", "https", "data"], iframe: ["http", "https"] },

        transformTags: {
            "*": (tagName, attribs) => {
                const out = { ...attribs };

                // 移除 on*
                for (const k of Object.keys(out)) if (/^on/i.test(k)) delete out[k];

                // style 属性：禁 @import / url(
                if (typeof out.style === "string" && out.style) {
                    let s = out.style;
                    s = s.replace(/@import\s+[^;]+;?/gi, "");
                    s = s.replace(/url\s*\(\s*[^)]+\s*\)/gi, "");
                    s = s.replace(/;;+/g, ";").trim();
                    if (!s) delete out.style;
                    else out.style = s;
                }

                // 兜底禁 javascript:
                for (const key of ["href", "src"]) {
                    if (out[key] && /^\s*javascript:/i.test(out[key])) out[key] = "";
                }

                // 仅允许 data:image/*
                if (tagName === "img" && typeof out.src === "string" && out.src.startsWith("data:")) {
                    if (!/^data:image\/(png|jpe?g|gif|webp|avif|bmp|svg\+xml);/i.test(out.src)) {
                        out.src = "";
                    }
                }

                return { tagName, attribs: out };
            },
        },
    });
}
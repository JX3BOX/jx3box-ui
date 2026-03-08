import { ElNotification } from "element-plus";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import searchMap from "./search_map.json";

const { __Root } = JX3BOX;

// 复制
export function copyText(text) {
    if (window.navigator.clipboard) {
        window.navigator.clipboard.writeText(text).then(
            function () {
                ElNotification.success({
                    title: "复制成功",
                });
                console.log("Async: Copying to clipboard was successful!");
            },
            function (err) {
                console.error("Async: Could not copy text: ", err);
                ElNotification.error({
                    title: "复制失败",
                    message: "无法复制到剪贴板",
                });
            }
        );
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand("copy");
            const msg = successful ? "successful" : "unsuccessful";
            console.log("Fallback: Copying text command was " + msg);

            if (successful) {
                ElNotification.success({
                    title: "复制成功",
                });
            } else {
                ElNotification.error({
                    title: "复制失败",
                    message: "浏览器复制失败",
                });
            }
        } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
            ElNotification.error({
                title: "复制失败",
                message: "浏览器不支持复制",
            });
        }

        document.body.removeChild(textArea);
    }
}

// 去除最后的 /
export function trimSlash(str) {
    return str.replace(/\/$/, "");
}

// 监听 localStorage 的改变
export function dispatchEventStorage() {
    const _setItem = localStorage.setItem;

    localStorage.setItem = function (key, val) {
        const setEvent = new Event("setItemEvent");
        setEvent.key = key;
        setEvent.newVal = val;

        window.dispatchEvent(setEvent);
        _setItem.apply(this, arguments);
    };
}

// search 跳转公共函数
export function searchJump({ searchValue, isPhone = false, client = "std", url }) {
    searchValue = searchValue.trim().toLowerCase();

    // 检查输入是否为纯数字
    if (/^\d+$/.test(searchValue)) {
        const target = isPhone ? "_self" : "_blank";
        const targetUrl = __Root + `post/${searchValue}`;

        if (target === "_blank") {
            window.open(targetUrl, "_blank");
        } else {
            window.location.href = targetUrl;
        }
    } else if (searchMap[searchValue]) {
        // 如果是 searchMap 中的关键词，跳转到对应的 URL
        const target = isPhone ? "_self" : "_blank";
        const targetUrl = searchMap[searchValue];

        if (target === "_blank") {
            window.open(targetUrl, "_blank");
        } else {
            window.location.href = targetUrl;
        }
    } else {
        // 如果不是纯数字，使用原有搜索功能
        const form = document.createElement("form");
        form.method = "GET";
        form.action = url;
        form.target = isPhone ? "_self" : "_blank";

        const searchInput = document.createElement("input");
        searchInput.type = "hidden";
        searchInput.name = "q";
        searchInput.value = searchValue;

        const clientInput = document.createElement("input");
        clientInput.type = "hidden";
        clientInput.name = "client";
        clientInput.value = client;

        form.appendChild(searchInput);
        form.appendChild(clientInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
}

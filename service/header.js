import axios from "axios";
import { $cms, $next } from "@jx3box/jx3box-common/js/api";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const GLOBAL_CONFIG_STORAGE_KEY = "jx3box:global-config";
let globalConfigPending = null;

function readGlobalConfigStorage() {
    try {
        const config = JSON.parse(sessionStorage.getItem(GLOBAL_CONFIG_STORAGE_KEY));
        // 旧格式 { time, data } 属于原来的六小时缓存，不再复用。
        return config && typeof config === "object" && !Array.isArray(config) && !config.time && !config.data
            ? config
            : null;
    } catch (e) {
        return null;
    }
}

function getGlobalConfigUrl() {
    const root = JX3BOX.__ossRoot || "https://cdn.jx3box.com/";
    return `${root.replace(/\/?$/, "/")}config/global.json`;
}

function getLetter() {
    return $next({ mute: true }).get("/api/letter/unread/count");
}

function getMsg() {
    return $next({ mute: true }).get("/api/next2/userdata/messages/unread_total");
}

function getNav(client = "std") {
    let file = client == "origin" ? "header_nav_origin.json" : "header_nav.json";
    return axios.get(JX3BOX.__dataPath + `data/box/${file}`);
}

function getPanel() {
    return axios.get(JX3BOX.__dataPath + "data/box/header_panel.json");
}

function getBox(client = "std") {
    let filename = client == "origin" ? "box_origin.json" : "box.json";
    return axios.get(JX3BOX.__dataPath + "data/box/" + filename);
}

function getMenu(key) {
    return $cms().get(`/api/cms/config/menu/${key}`);
}

function getGames() {
    return axios.get(JX3BOX.__dataPath + "data/product/games.json");
}

// 标签页会话内复用配置，不设置时间有效期；网络请求仍遵循浏览器 HTTP 缓存。
function getGlobalConfig({ force = false } = {}) {
    if (!force) {
        const config = readGlobalConfigStorage();
        if (config) return Promise.resolve(config);
    }
    if (!globalConfigPending) {
        globalConfigPending = axios
            .get(getGlobalConfigUrl())
            .then((res) => {
                const config = res.data || {};
                try {
                    sessionStorage.setItem(GLOBAL_CONFIG_STORAGE_KEY, JSON.stringify(config));
                } catch (e) {}
                return config;
            })
            .finally(() => {
                globalConfigPending = null;
            });
    }
    return globalConfigPending;
}

export { getLetter, getMsg, getNav, getPanel, getBox, getMenu, getGames, getGlobalConfig };

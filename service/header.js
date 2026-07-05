import axios from "axios";
import { $cms, $next } from "@jx3box/jx3box-common/js/api";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const GLOBAL_CONFIG_STORAGE_KEY = "jx3box:global-config";
const GLOBAL_CONFIG_TTL = 6 * 60 * 60 * 1000;
let globalConfigCache = null;
let globalConfigPending = null;

function getGlobalConfigUrl() {
    const root = JX3BOX.__ossRoot || "https://cdn.jx3box.com/";
    return `${root.replace(/\/?$/, "/")}config/global.json`;
}

function getNow() {
    return Date.now ? Date.now() : new Date().getTime();
}

function readGlobalConfigStorage() {
    if (typeof sessionStorage === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(GLOBAL_CONFIG_STORAGE_KEY);
        if (!raw) return null;
        const cache = JSON.parse(raw);
        if (!cache?.data || !cache?.time) return null;
        if (getNow() - cache.time > GLOBAL_CONFIG_TTL) return null;
        return cache.data;
    } catch (e) {
        return null;
    }
}

function writeGlobalConfigStorage(data) {
    if (typeof sessionStorage === "undefined") return;
    try {
        sessionStorage.setItem(
            GLOBAL_CONFIG_STORAGE_KEY,
            JSON.stringify({
                time: getNow(),
                data,
            })
        );
    } catch (e) {}
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

// 获取全局配置
function getGlobalConfig() {
    if (globalConfigCache) return Promise.resolve(globalConfigCache);

    const storageConfig = readGlobalConfigStorage();
    if (storageConfig) {
        globalConfigCache = storageConfig;
        return Promise.resolve(globalConfigCache);
    }

    if (!globalConfigPending) {
        globalConfigPending = axios
            .get(getGlobalConfigUrl())
            .then((res) => {
                globalConfigCache = res.data || {};
                writeGlobalConfigStorage(globalConfigCache);
                return globalConfigCache;
            })
            .finally(() => {
                globalConfigPending = null;
            });
    }

    return globalConfigPending;
}

export { getLetter, getMsg, getNav, getPanel, getBox, getMenu, getGames, getGlobalConfig };

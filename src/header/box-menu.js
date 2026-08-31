import axios from "axios";
import { flatten } from "lodash";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const BOX_MENU_CACHE_KEY = "jx3box:box-menu:app-v1";

function readCache() {
    try {
        const data = JSON.parse(sessionStorage.getItem(BOX_MENU_CACHE_KEY));
        return Array.isArray(data) && data.length ? data : null;
    } catch (e) {
        return null;
    }
}

function writeCache(data) {
    try {
        sessionStorage.setItem(BOX_MENU_CACHE_KEY, JSON.stringify(data));
    } catch (e) {}
}

export function loadBoxMenu(fallback = []) {
    const cached = readCache();
    if (cached) return Promise.resolve(cached);

    return axios
        .get(JX3BOX.__imgPath + "logo/app.json")
        .then((res) => {
            const source = flatten(Object.values(res.data || {}));
            const data = source.map((item) => ({
                img: item.key + ".svg",
                uuid: item.key,
                abbr: item.label,
                href: item.link,
                client: item.client || ["std", "origin"],
            }));
            const result = data.length ? data : fallback;
            writeCache(result);
            return result;
        })
        .catch(() => fallback);
}

import axios from "axios";
import { flatten } from "lodash";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const BOX_MENU_CACHE_KEY = "jx3box:box-menu:app-v2";
let pendingMenu = null;

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

    if (pendingMenu) return pendingMenu;
    pendingMenu = axios
        .get(JX3BOX.__imgPath + "logo/app.json")
        .then((res) => {
            const source = flatten(Object.values(res.data || {}));
            const data = source.map((item) => ({
                img: item.key + ".svg",
                uuid: item.key,
                label: item.label,
                abbr: item.abbr || item.label,
                href: item.link,
                client: item.client || ["std", "origin"],
            }));
            const result = data.length ? data : fallback;
            writeCache(result);
            return result;
        })
        .catch(() => fallback)
        .finally(() => {
            pendingMenu = null;
        });
    return pendingMenu;
}

export function findBoxMenuLink(menu, keyword, client = "std") {
    const query = String(keyword || "").trim().toLowerCase();
    if (!query) return null;
    const matches = menu.filter((item) => {
        const clients = (Array.isArray(item.client) ? item.client : String(item.client || "").split(","))
            .map((value) => String(value).trim().toLowerCase())
            .filter(Boolean);
        const visible = item.status == null || !!item.status;
        const matchedClient = !clients.length || clients.includes("all") || clients.includes(client.toLowerCase());
        return visible && matchedClient && [item.label, item.abbr].some(
            (name) => name && name.trim().toLowerCase() === query
        );
    });
    const links = [...new Set(matches.map((item) => item.href).filter(Boolean))];
    return links.length === 1 ? links[0] : null;
}

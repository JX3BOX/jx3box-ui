import axios from "axios";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { $node } from "@jx3box/jx3box-common/js/api";

const { __node, __helperUrl } = JX3BOX;

function loadResource(type, query, params) {
    switch (type) {
        case "item":
            return axios
                .get(`${__helperUrl}api/item/search`, {
                    params: { keyword: query, page: params.page, limit: params.per },
                    headers: {
                        Accept: "application/prs.helper.v2+json",
                        "JX3-Client-Type": params.client == "origin" ? 2 : 1,
                    },
                    withCredentials: true,
                })
                .then((res) => {
                    let data = res.data;
                    return data.code === 200 ? data.data : null;
                })
                .catch((err) => {
                    console.log(err);
                });
        default: {
            let condition = isNaN(query) ? "name" : "id";
            return axios
                .get(__node + `${type}/${condition}/${query}`, {
                    params: params,
                })
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
}

function loadStat({client = 'std'} = {}) {
    return axios
        .get(__node, {
            params: {
                client,
            }
        })
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            console.log(err);
        });
}

function getIcons(query, params) {
    return axios
        .get(__node + "icon/name/" + query, {
            params: params,
        })
        .then((res) => {
            let data = res.data;
            let list = [...data.skill, ...data.buff, ...data.item];
            // 去重
            let _set = new Set();
            list.forEach((item) => {
                _set.add(item.iconID);
            });
            // 重组
            let _list = [];
            _set.forEach((item) => {
                _list.push({
                    iconID: item,
                    isSelected: false,
                });
            });
            list = Array.from(_list);
            return list;
        })
        .catch((err) => {
            console.log(err);
        });
}

function getBuff(client = "std", id, level) {
    return $node().get("/buff/id/" + id, {
        params: {
            client: client,
            level: level,
        },
    });
}

function getSkill(client = "std", id, level) {
    return $node().get("/skill/id/" + id, {
        params: {
            client: client,
            level: level,
        },
    });
}

function getNpc(client = 'std', id) {
    return $node().get('/npc/id/' + id, {
        params: {
            client,
            strict: 0,
            per: 10,
            page: 1
        }
    })
}

export { loadResource, loadStat, getIcons, getBuff, getSkill, getNpc };

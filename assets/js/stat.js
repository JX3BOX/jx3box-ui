import {
    Reporter
} from "@jx3box/reporter"
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
import { $next } from "@jx3box/jx3box-common/js/api";

const { __Domain } = JX3BOX;

/**
     * 16进制转int
     * @param {string} str
     * @returns
     * @memberof stat
    */
function int162hex(str) {
    let hex = str.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * 二进制转hex
 * @param {string} str
 */
function bin2hex(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        result += int162hex(str.charCodeAt(i));
    }
    return result;
}

/**
 * 获取uuid
 */
function getUUID(domain = __Domain) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const txt =  domain;
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);

    const b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    const bin = atob(b64);
    const crc = bin2hex(bin.slice(-16, -12));
    return crc;
}

// 统计指令
const stat = {
    /**
     * 上报指令 vue2
     * @param {string} user_id 用户id 使用User.getInfo().uid获取
     * @param {boolean} use_query 是否上报当前页面中url中的参数 默认false
     * @param {string} caller 上报来源
     * @param {object} data 上报数据
     */
    install(Vue) {
        Vue.directive("stat", {
            mounted: function (el, binding) {
                el.clickHandler = function () {
                    const {
                        user_id,
                        use_query = false,
                        caller,
                        data
                    } = binding.value;

                    const R = new Reporter({
                        caller,
                        use_query, // 上报当前页面中url中的参数 默认false
                        useId: user_id // 当前登录用户id
                    });

                    R.p({ uuid: getUUID(), ...data })
                };

                el.addEventListener("click", el.clickHandler);
            },
            unmounted: function (el) {
                el.removeEventListener("click", el.clickHandler);
                el.clickHandler = null;
            }
        });
    }
}

/**
 * 添加历史记录
 * @param {*} data
 * @param {*} data.source_type 例如：macro,community
 * @param {*} data.source_id 例如：文章id，帖子id
 * @param {*} data.link 例如：文章链接，帖子链接
 * @param {*} data.title 例如：文章标题，帖子标题
 * @returns
 */
export function postHistory(data) {
    return $next({mute: true}).post("/api/next2/userdata/visit-history/item", data);
}

export default stat;

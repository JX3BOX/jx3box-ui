import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

import { ElNotification as Notification } from "element-plus";
import { $cms, $next } from "@jx3box/jx3box-common/js/api";
import User from "@jx3box/jx3box-common/js/user";

const KEY = "cmt_order";
const { __Links } = JX3BOX;
const $ = $next({ interceptor: false, mute: true });

export async function getOrderMode() {
    if (User.isLogin()) {
        return $cms({ mute: true })
            .get(`/api/cms/user/conf`, {
                params: {
                    key: KEY,
                },
            })
            .then((res) => {
                return res.data.data;
            });
    } else {
        return new Promise((resolve) => {
            const key = localStorage.getItem(KEY) || "DESC";
            resolve(key);
        });
    }
}

export async function setOrderMode(val) {
    if (User.isLogin()) {
        return $cms()
            .put(
                `/api/cms/user/conf`,
                {
                    val: val,
                },
                {
                    params: {
                        key: KEY,
                    },
                }
            )
            .then((res) => {
                return res.data.data;
            });
    } else {
        return new Promise((resolve) => {
            resolve(localStorage.setItem(KEY, val));
        });
    }
}

export const GET = function (url, queryParams) {
    return $
        .get(url, {
            params: queryParams,
        })
        .then((res) => res.data)
        .catch((err) => __handleError(err));
};

const postRecord = {};

export const POST = function (url, queryParams, body) {
    if (!postRecord[url]) {
        postRecord[url] = {
            lastest: Date.now(),
            count: 0,
        };
        // 60 秒内发送评论超过10条
    } else if (Date.now() - postRecord[url].lastest < 60 * 1000) {
        if (postRecord[url].count >= 6) {
            Notification.warning({
                title: "系统",
                message: "你单身多久了? 动作这么快, 系统处理不过来 ( T_T )",
                duration: 3000,
                position: "bottom-right",
            });
            return new Promise((reslove, reject) => {
                reject();
            });
        } else {
            postRecord[url].count = postRecord[url].count + 1;
        }
    } else if (Date.now() - postRecord[url].lastest > 60 * 1000) {
        postRecord[url] = {
            lastest: Date.now(),
            count: 0,
        };
    }
    return $
        .post(url, body, {
            params: queryParams,
        })
        .then((res) => res.data)
        .catch((err) => __handleError(err));
};
export const PUT = function (url, queryParams, body) {
    return $
        .put(url, body, {
            params: queryParams,
        })
        .then((res) => res.data)
        .catch((err) => __handleError(err));
};

export const DELETE = function (url, queryParams) {
    return $
        .delete(url, {
            params: queryParams,
        })
        .then((res) => res.data)
        .catch((err) => __handleError(err));
};

function __handleError(err) {
    const status = err?.response?.status;
    const statusText = err?.response?.statusText || "Request Error";
    const message = err?.response?.data?.msg || err?.response?.data || "";
    switch (status) {
        case 401:
        case 403:
            window.location.href = __Links.account.login + "?redirect=" + encodeURIComponent(window.location.href);
            break;
        case 423:
            window.location.href = __Links.account.email_verify + "?redirect=" + encodeURIComponent(window.location.href);
            break;
        case 406:
            Notification.warning({
                title: "系统",
                message: message || "提交内容不合法,请重新提交",
                duration: 3000,
                position: "bottom-right",
            });
            break;
        default:
            Notification.error({
                title: "系统:" + statusText,
                message: message || "系统错误,请稍后重试!",
                duration: 3000,
                position: "bottom-right",
            });
            break;
    }
    return Promise.reject(err);
}

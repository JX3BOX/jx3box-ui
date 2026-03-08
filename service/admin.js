import { $cms } from "@jx3box/jx3box-common/js/api";

function getSetting(id) {
    return $cms()
        .get(`/api/cms/manage/post/${id}`)
        .then((res) => {
            return res.data.data;
        });
}

function postSetting(data) {
    return $cms().put(`/api/cms/manage/post/${data.ID}`, data);
}

// 管理员发送私信
function sendMessage(data) {
    return $cms().post(`/api/cms/manage/message`, data);
}

export { getSetting, postSetting, sendMessage };

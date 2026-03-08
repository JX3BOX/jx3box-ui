/**
 * bind
 * @param {*} BindType 绑定类型
 */

export default (BindType) => {
    switch (BindType) {
        case 1:
            return '不绑定';
        case 2:
            return '装备后绑定';
        case 3 :
            return '拾取后绑定';
        default:
            return '未知'
    }
}


/**
 * IconID 转 URL
 *
 * @param {*} icon_id IconID
 */
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __imgPath, __iconPath } = JX3BOX;

export default (icon_id) => {
    if (isNaN(parseInt(icon_id))) {
        return `${__imgPath}image/common/nullicon.png`;
    } else {
        return `${__iconPath}icon/${icon_id}.png`;
    }
};

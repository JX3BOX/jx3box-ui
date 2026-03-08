/**
 * border_quest
 * @param {*} item 物品对象
 */
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __imgPath } = JX3BOX;

export default (item) => {
    if (item.IsQuest > 0) return `url(${__imgPath}image/item/renwu.png)`;
    return '';
}


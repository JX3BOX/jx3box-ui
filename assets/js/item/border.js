/**
 * border
 * @param {*} item 物品对象
 */
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";
const { __imgPath } = JX3BOX;

export default (item) => {
    switch (item.Quality) {
        case 3:
            return `url(${__imgPath}image/item/blue.png)`;
        case 4:
            return `url(${__imgPath}image/item/purple.png)`;
        case 5:
            return `url(${__imgPath}image/item/orange.gif)`;
        default:
            return "";
    }
};

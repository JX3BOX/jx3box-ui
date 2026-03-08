/**
 * 获取装备部位信息
 */
import EquipType from "./EquipType";

const EquipPosition = Object.freeze({
    HELM: EquipType.HELM, // 帽子
    CHEST: EquipType.CHEST, // 上衣
    WAIST: EquipType.WAIST, // 腰带
    BANGLE: EquipType.BANGLE, // 护腕
    PANTS: EquipType.PANTS, // 下装
    BOOTS: EquipType.BOOTS, // 鞋子
    AMULET: EquipType.AMULET, // 项链
    PENDANT: EquipType.PENDANT, // 腰坠
    RING_1: `${EquipType.RING}_1`, // 戒指1
    RING_2: `${EquipType.RING}_2`, // 戒指2
    MELEE_WEAPON: EquipType.MELEE_WEAPON, // 近身武器
    RANGE_WEAPON: EquipType.RANGE_WEAPON, // 远程武器

    all() {
        // 部位配置信息
        let positions = [
            { type: this.MELEE_WEAPON, label: "武器", AucGenre: 1 },
            { type: this.RANGE_WEAPON, label: "暗器", AucGenre: 2 },
            { type: this.HELM, label: "帽子", AucGenre: 3, AucSubType: 2 },
            { type: this.CHEST, label: "上衣", AucGenre: 3, AucSubType: 1 },
            { type: this.WAIST, label: "腰带", AucGenre: 3, AucSubType: 3 },
            { type: this.BANGLE, label: "护腕", AucGenre: 3, AucSubType: 6 },
            { type: this.PANTS, label: "下装", AucGenre: 3, AucSubType: 4 },
            { type: this.BOOTS, label: "鞋子", AucGenre: 3, AucSubType: 5 },
            { type: this.AMULET, label: "项链", AucGenre: 4, AucSubType: 1 },
            { type: this.PENDANT, label: "腰坠", AucGenre: 4, AucSubType: 3 },
            { type: this.RING_1, label: "戒指", AucGenre: 4, AucSubType: 2 },
            { type: this.RING_2, label: "戒指", AucGenre: 4, AucSubType: 2 },
        ];

        // 重置键名
        let output = {};
        for (let i in positions) {
            let position = positions[i];
            output[position.type] = position;
        }

        return output;
    },
});

export default EquipPosition;

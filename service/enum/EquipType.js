const EquipType = Object.freeze({
    HELM: "helm", // 帽子
    CHEST: "chest", // 上衣
    WAIST: "waist", // 腰带
    BANGLE: "bangle", // 护腕
    PANTS: "pants", // 下装
    BOOTS: "boots", // 鞋子
    AMULET: "amulet", // 项链
    PENDANT: "pendant", // 腰坠
    RING: "ring", // 戒指
    MELEE_WEAPON: "melee_weapon", // 近身武器
    RANGE_WEAPON: "range_weapon", // 远程武器
    AMMO_POUCH: "ammo_pouch", // 暗器弹药

    all() {
        return [
            this.HELM,
            this.CHEST,
            this.WAIST,
            this.BANGLE,
            this.PANTS,
            this.BOOTS,
            this.AMULET,
            this.PENDANT,
            this.RING,
            this.MELEE_WEAPON,
            this.RANGE_WEAPON,
            this.AMMO_POUCH,
        ];
    },
});

export default EquipType;

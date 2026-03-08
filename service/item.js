import { $helper } from "@jx3box/jx3box-common/js/api";

// 获取物品
function get_item(item_id, client) {
    if (!item_id) return;
    let options = {
        url: `/api/item/${item_id}`,
        params : {
            client
        }
    };
    return $helper({ mute: true })(options);
}

// 获取清单
function get_plan(plan_id) {
    return $helper()({
        url: `api/item_plan/${plan_id}`,
    });
}

export { get_item, get_plan };

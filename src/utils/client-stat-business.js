// JX3BOX 项目专属统计规则。
// 通用统计层先产出 context，再由本模块按 JX3BOX 业务语义覆盖；未来抽公共包时作为业务适配器注入。
export function applyJx3boxClientStatRules(context, environment = {}) {
    const userAgent = String(environment.userAgent || "");
    if (/jianghudaily/i.test(userAgent)) {
        return { ...context, client: "mobile_game" };
    }
    return context;
}

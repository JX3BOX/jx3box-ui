import $ from "jquery";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

function renderCombo(selector = ".e-skill-combo .w-skill-combo-item") {
    try {
        let html = ''
        $(selector).each(function() {
            // 获取嵌入源地址
            let url = $(this).text();

            // extend = {gcd: 0}
            const [id, name, icon, extend] = url.split(",");
            // 去除左右花括号


            const _extend = extend ? JSON.parse(extend) : null;

            // 渲染
            let code = `
                <span class="w-skill-combo-item" data-id="${id}">
                    <img class="u-skill-icon" src="${iconLink(icon)}" alt="${icon}" title="${name}" />
                    <span class="u-skill-name" title="${name}">${name}</span>
                    <i class="u-gcd-icon ${_extend && _extend.gcd == 0 ? 'is-show' : ''}" title="无GCD技能">
                        <i class="el-icon-time"></i>
                    </i>
                </span>
            `;
            html += code;
        });

        // console.log(html)

        // 挂载点
        $(selector).parent().html(html);
    } catch(e) {
        console.log(e)
    }
}

export default renderCombo;

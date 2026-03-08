import $ from "jquery";
import { Base64 } from "js-base64";
function talent2(selector = ".e-jx3talent2-area") {
    try {
        $(selector).each(function() {
            // 挂载点
            $(this).after('<div class="e-jx3talent2-temp-container" style="width:100%;height:525px;overflow:hidden;"></div>');
            let container = $(this).next(".e-jx3talent2-temp-container");

            // 内容解析
            let talent = $(this).text();
            let code = Base64.encode(talent);
            let url = "https://oss.jx3box.com/static/jx3box-talent2/index.html" + "?code=" + code;

            container.html(`<iframe src="${url}" width="100%" height="100%" style="overflow:hidden;border:none;"></iframe>`);
        });
    } catch (e) {
        console.error(e);
    }
}
export default talent2;

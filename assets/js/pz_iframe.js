import $ from "jquery";
function buildIframe(str){
    let _str = new URLSearchParams(str);
    let mode = _str.get('mode')

    if(mode == 'vertical'){
        return `<iframe class="w-pz-iframe" src="${str}" scrolling="no" width="750" height="3468" style="border:none;background:none;max-width:100%;overflow:hidden;"></iframe>`
    }else{
        return `<iframe class="w-pz-iframe" src="${str}" scrolling="no" width="1280" height="720" style="border:none;background:none;max-width:100%;overflow:hidden;"></iframe>`
    }
}

function renderPzIframe(selector = ".e-pz-iframe"){
    try {
        $(selector).each(function() {
            // 获取嵌入源地址
            let url =  $(this).text();

            // 构建嵌入源码
            let code = buildIframe(url)

            // 挂载点
            $(this).after(code);
        });
    } catch (e) {
        console.error(e);
    }
}

export default renderPzIframe

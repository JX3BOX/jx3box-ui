import JX3_QIXUE from '@jx3box/jx3box-talent'
import $ from 'jquery'

function qixue(selector=".e-jx3qixue-area"){
    try {
        $(selector).each(function (){

            // 挂载点
            $(this).after('<div class="e-jx3qixue-temp-container"></div>')
            let container = $(this).next('.e-jx3qixue-temp-container')

            // 内容解析
            let qixue = ''
            if($(this)[0].tagName == "INPUT"){
                qixue = JSON.parse($(this).val())
            }else{
                qixue = JSON.parse($(this).text())
            }

            let _qixue = Object.assign({container:container},{...qixue, client: qixue?.client || 'std'})
            new JX3_QIXUE(_qixue)
        })
    } catch (e) {
        console.error(e);
    }
}
export default qixue


import $ from "jquery";

function renderItem(vm, selector = ".w-jx3-element") {

    let outer, inner;
    const pop_class = '.w-jx3-element-pop'

    // 触发时
    $(selector).on("mouseenter", function (e) {
        clearTimeout(outer);

        // 获取元素数据
        let type = $(e.target).attr("data-type");
        if (type == 'item') {
            vm.item = {}
            vm.item.id = $(e.target).attr("data-id");
            vm.item.client = $(e.target).attr("data-client") == 'origin' ? 2 : 1;
        } else if (type === 'author') {
            vm.author = {}
            vm.author.id = $(e.target).attr("data-id");
        } else if (type === 'emotion') {
            vm.emotion = {}
            vm.emotion.id = $(e.target).attr("data-id");
        } else {
            vm[type] = {}
            vm[type].client = $(e.target).attr("data-client");
            vm[type].id = $(e.target).attr("data-id");
            vm[type].level = $(e.target).attr("data-level");
        }

        // 显示浮层
        $(pop_class).fadeIn();
        vm.jx3_element ? '' : vm.jx3_element = {
            style: {},
            type: ''
        }
        vm.jx3_element.type = type

        // 计算浮层位置
        let self_height = $(pop_class).height();
        let win_height = window.innerHeight;
        let current_y = e.clientY;
        let will_stay_y = e.clientY + 10;

        if (self_height && win_height - current_y < self_height) {
            will_stay_y =
                current_y - (self_height - (win_height - current_y)) - 100;
        }
        vm.jx3_element.style.left = e.clientX + 10 + "px";
        vm.jx3_element.style.top = will_stay_y + "px";
    });

    // 移除时
    $(selector).on("mouseleave", function () {
        outer = setTimeout(() => {
            $(pop_class).fadeOut();
        }, 380);
    });

    // POP内停留
    $(pop_class).on("mouseenter", function () {
        clearTimeout(outer);
        $(pop_class).fadeIn();
    });
    $(pop_class).on("mouseleave", function () {
        clearTimeout(inner);
        inner = setTimeout(() => {
            $(pop_class).fadeOut();
        }, 280);
    });
}

export default renderItem;

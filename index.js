import Header from "./src/CommonHeader.vue";
import Footer from "./src/Footer.vue";
import Main from "./src/Main.vue";
import Breadcrumb from "./src/Breadcrumb.vue";
import LeftSidebar from "./src/LeftSidebar.vue";
import RightSidebar from "./src/RightSidebar.vue";
import LeftSideToggle from "./src/LeftSideToggle.vue";

import markBy from "./src/filters/markBy.vue";
import tagBy from "./src/filters/tagBy.vue";
import orderBy from "./src/filters/orderBy.vue";
import menuBy from "./src/filters/menuBy.vue";
import clientBy from "./src/filters/clientBy.vue";
import zlpBy from "./src/filters/zlpBy.vue";
import topicBy from "./src/filters/topicBy.vue";

import Item from "./src/editor/components/Item.vue";
import ItemSimple from "./src/editor/components/ItemSimple.vue";
import GameText from "./src/editor/components/GameText.vue";

const components = {
    Header,
    Footer,
    Main,
    Breadcrumb,
    LeftSidebar,
    RightSidebar,
    LeftSideToggle,

    tagBy,
    orderBy,
    markBy,
    menuBy,
    clientBy,
    zlpBy,
    topicBy,

    Item,
    ItemSimple,
    GameText,
};

const install = function (app) {
    Object.keys(components).forEach((key) => {
        app.component(key, components[key]);
    });
};

export { install };

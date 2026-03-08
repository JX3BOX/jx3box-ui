/*
 * @Author: X3ZvaWQ
 * @Date: 2022-08-20 22:17:27
 * @LastEditors: X3ZvaWQ
 * @LastEditTime: 2022-08-20 23:54:41
 * @Description:
 */
import { $node } from "@jx3box/jx3box-common/js/api";
const $ = $node();

/* import axios from 'axios'
const $ = axios.create({
    baseURL: 'http://localhost:7002/',
}) */

function getResource(type, ids, client = "std") {
    return $.post(`/resource/${client}/${type}/`, { ids });
}

function getSkill(query, params) {
    let condition = isNaN(query) ? "name" : "id";
    return $node().get(`/skill/${condition}/${query}`, {
        params: params,
    }).then(res => {
        return res.data;
    }).catch((err) => {
        console.log(err);
    });
}

export { getResource, getSkill };

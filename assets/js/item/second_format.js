/**
 * second_format
 * @param {*} second 秒
 */

export default (second) => {
    let day = Math.floor(second / (24 * 3600)); // Math.floor()向下取整
    let hour = Math.floor((second - day * 24 * 3600) / 3600);
    let minute = Math.floor((second - day * 24 * 3600 - hour * 3600) / 60);
    second = second - day * 24 * 3600 - hour * 3600 - minute * 60;

    let output = '';
    if (day) output += day + "天";
    if (hour) output += hour + "小时";
    if (minute) output += minute + "分钟";
    if (second) output += second + "秒";
    return output;
}


/**
 * 品质 转 颜色
 *
 * @param {*} quality
 */
export default (quality) => {
    quality = parseInt(quality);
    switch (quality) {
        case 0:
            return 'rgb(167,167,167)';
        case 1:
            return 'rgb(255,255,255)';
        case 2:
            return 'rgb(0,210,75)';
        case 3 :
            return 'rgb(0,126,255)';
        case 4:
            return 'rgb(254,45,254)';
        case 5:
            return 'rgb(255,165,0)';
        default:
            return 'rgb(167,167,167)'
    }
}


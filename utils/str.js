function toCamelCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function toHyphenCase(inputString) {
    return inputString.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function capitalizeFirstLetter(str) {
    // 判断字符串是否为空
    if (!str) {
        return str;
    }

    // 将第一个字符转换为大写，然后与字符串的其余部分拼接起来
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { toCamelCase, toHyphenCase, capitalizeFirstLetter }
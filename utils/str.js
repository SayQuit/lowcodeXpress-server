function toCamelCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function transfromConstToVariable(arr) {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        if (!isNaN(value)) {
            result += `[${value}]`;
        } else {
            result += (i === 0 ? '' : '.') + value;
        }
    }
    return `{item.${result}}`;
}

module.exports = { toCamelCase, transfromConstToVariable }
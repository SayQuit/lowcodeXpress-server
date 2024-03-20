const { parseReactCode } = require('./reactCode')
const { parseVueCode } = require('./vueCode')
const { parseWechatMiniProgramCode } = require('./wechatMiniProgramCode')

async function parseElementToFile(element, name, type, tech, lib, variable, event, props, onload) {
    return new Promise((resolve) => {
        if (type === 'react') resolve(parseReactCode(element, name, lib, variable, event, props, onload))
        else if (type === 'vue') resolve(parseVueCode(element, name, lib, variable, event, props, onload))
        else if (type === 'wechat mini program') resolve(parseWechatMiniProgramCode(element, name, lib, variable, event, props, onload))
    })
}

module.exports = { parseElementToFile }


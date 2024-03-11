const { parseReactCode } = require('./reactCode')
const { parseVueCode } = require('./vueCode')

async function parseElementToFile(element, name, type, tech, lib, variable, event, props, onload) {
    return new Promise((resolve) => {
        if (tech === 'react') resolve(parseReactCode(element, name, lib, variable, event, props, onload))
        else if (tech === 'vue') resolve(parseVueCode(element, name, lib, variable, event, props, onload))
    })
}

module.exports = { parseElementToFile }


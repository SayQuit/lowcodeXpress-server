const { reactTemplate } = require('../template/index')

async function parseElementToFile(element, name, type, tech, lib, variable, event, props, onload) {
    return new Promise((resolve, reject) => {

        resolve( reactTemplate(element, name, lib, variable, event, props, onload))
    })
}
module.exports = { parseElementToFile }

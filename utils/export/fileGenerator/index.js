const { generateJSXFile } = require('./jsxFile')
const { generateVueFile } = require('./vueFile')

const generateFile = (code, name, folderPath, tech) => {
    if (tech === 'react') generateJSXFile(code, name, folderPath)
    else if (tech === 'vue') generateVueFile(code, name, folderPath)
}

module.exports = { generateFile }
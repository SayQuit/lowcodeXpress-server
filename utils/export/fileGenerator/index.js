const { generateJSXFile } = require('./jsxFile')

const generateFile = (code, name, folderPath) => {
    generateJSXFile(code, name, folderPath)
}

module.exports = { generateFile }
const { generateJSXFile } = require('./jsxFile')
const { generateVueFile } = require('./vueFile')
const { generateWechatMiniProgramFile } = require('./wechatMiniProgram')

const generateFile = async (code, name, folderPath, tech) => {
    if (tech === 'react') generateJSXFile(code, name, folderPath)
    else if (tech === 'vue') generateVueFile(code, name, folderPath)
    else if (tech === 'wechat mini program')await generateWechatMiniProgramFile(code, name, folderPath)
}

module.exports = { generateFile }
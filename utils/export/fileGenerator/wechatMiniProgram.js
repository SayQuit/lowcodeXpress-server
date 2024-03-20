const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

async function generateWechatMiniProgramFile(code, name, folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    if (!fs.existsSync(path.join(folderPath, name))) {
        fs.mkdirSync(path.join(folderPath, name));
    }

    const wxmlPath = path.join(path.join(folderPath, name), `${name}.wxml`);
    const wxssPath = path.join(path.join(folderPath, name), `${name}.wxss`);
    const jsPath = path.join(path.join(folderPath, name), `${name}.js`);
    const jsonPath = path.join(path.join(folderPath, name), `${name}.json`);

    const templateContent = fs.readFileSync(path.join(__dirname, './wx.js'), 'utf8')
    const javsScript = await prettier.format(templateContent
        .replace('__properties__', code.properties)
        .replace('__data__', code.data)
        .replace('__methods__', code.methods)
        .replace('__onload__', code.onload ? `this.${code.onload}` : ''), { parser: 'babel', printWidth: 120, singleQuote: true, })
    fs.writeFileSync(wxmlPath, code.wxml);
    fs.writeFileSync(wxssPath, '');
    fs.writeFileSync(jsPath, javsScript);
    fs.writeFileSync(jsonPath, `{"component": true,"usingComponents": {}}`);
}

module.exports = { generateWechatMiniProgramFile }
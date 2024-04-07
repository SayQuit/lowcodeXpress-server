const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

function formatStyleToOneLine(wxmlString) {
    // 使用正则表达式匹配出所有 style 属性的值
    const styleRegex = /style="([^"]*)"/g;
    
    // 替换函数，将匹配到的 style 属性值进行处理
    const replacedString = wxmlString.replace(styleRegex, (match, styleValue) => {
      // 将 style 属性值中的换行符和多余的空格去除
      const trimmedStyleValue = styleValue.replace(/\n\s*/g, ' ');
      return `style="${trimmedStyleValue}"`;
    });
    
    return replacedString;
  }

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
        .replace('__onload__', code.onload ? `  created:function(){this.${code.onload}()},` : ''), { parser: 'babel', printWidth: 120, singleQuote: true,})
    fs.writeFileSync(wxmlPath, formatStyleToOneLine(code.wxml));
    fs.writeFileSync(wxssPath, '');
    fs.writeFileSync(jsPath, javsScript);
    fs.writeFileSync(jsonPath, `{"component": true,"usingComponents": {}}`);
}

module.exports = { generateWechatMiniProgramFile }
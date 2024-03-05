const { reactTemplate } = require('../template/index')
const fs = require('fs');
const path = require('path');

async function parseElementToFile(element, name, type, tech, lib, variable, event, props, onload) {
    return new Promise((resolve, reject) => {

        resolve(reactTemplate(element, name, lib, variable, event, props, onload))
    })
}


function generateJSXFile(code, name) {
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, `${name}.jsx`);

    fs.writeFileSync(filePath, code);
}


module.exports = { parseElementToFile, generateJSXFile }

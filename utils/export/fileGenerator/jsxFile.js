const fs = require('fs');
const path = require('path');

function generateJSXFile(code, name, folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const filePath = path.join(folderPath, `${name}.jsx`);

    fs.writeFileSync(filePath, code);
}

module.exports = { generateJSXFile }
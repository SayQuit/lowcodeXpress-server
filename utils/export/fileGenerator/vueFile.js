const fs = require('fs');
const path = require('path');

function generateVueFile(code, name, folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const filePath = path.join(folderPath, `${name}.vue`);

    fs.writeFileSync(filePath, code);
}

module.exports = { generateVueFile }
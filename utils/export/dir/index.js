const fs = require('fs');
const path = require('path');

const createDir = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) reject()
            else resolve()
        });
    })
}
async function deleteDirRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteDirRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}

module.exports = { createDir, deleteDirRecursive }

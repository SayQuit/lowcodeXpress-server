const { reactTemplate } = require('../template/index')
const fs = require('fs');
const path = require('path');
const { toHyphenCase } = require('../str');
const util = require('util');
const fsExtra = require('fs-extra');

const exec = util.promisify(require('child_process').exec);


async function parseElementToFile(element, name, type, tech, lib, variable, event, props, onload) {
    return new Promise((resolve, reject) => {

        resolve(reactTemplate(element, name, lib, variable, event, props, onload))
    })
}


function generateJSXFile(code, name, folderPath) {
    const tempDir = path.join(__dirname, folderPath);
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, `${name}.jsx`);

    fs.writeFileSync(filePath, code);
}

const createDir = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(folderPath, { recursive: true }, (err) => {
            if (err) reject()
            else resolve()
        });
    })
}

const createReactProject = async (name, newPath) => {
    const reactPath = path.join(__dirname, '../../project_template/react')
    console.log(reactPath);
    try {
        await fsExtra.copy(reactPath, path.join(__dirname, newPath));
    } catch (err) {
    }

};


const createVueProject = (name, path) => {
    exec('vue --version', (err) => {
        if (err) {
            console.error('请确保已经安装vue');
            return;
        }

        const command = `vue create ${toHyphenCase(name)}`;
        const options = {
            cwd: path.resolve(path || process.cwd()),
            stdio: 'inherit',
        };

        exec(command, options, () => { });
    });
};
function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        console.log(fs.readdirSync(folderPath));
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}

module.exports = { parseElementToFile, generateJSXFile, createDir, createReactProject, createVueProject, deleteFolderRecursive }

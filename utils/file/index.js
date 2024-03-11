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
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const filePath = path.join(folderPath, `${name}.jsx`);

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
    try {
        const command = `npx create-react-app ${toHyphenCase(name)}`;
        await exec(command, { cwd: newPath });
    } catch (error) {
        console.error('创建React项目时出现错误：', error.message);
    }
};

const buildReactProject = async (path) => {
    try {
        const command = `npm run build`;
        await exec(command, { cwd: path });
    } catch (error) {
        console.error('打包React项目时出现错误：', error.message);
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
async function modifyReactAppFile(filePath, componentName) {
    try {

        const templateContent = fs.readFileSync(path.join(__dirname, './ReactApp.js'), 'utf8')
        const modifiedContent = templateContent.replace(`__import__`, `import ${componentName} from '../src/component/${componentName}'`).replace(`__component__`, `<${componentName}></${componentName}>`)
        fs.writeFileSync(filePath, modifiedContent, 'utf8');

    } catch (error) {
        console.error('Error reading or modifying file:', error);
    }
}

module.exports = { parseElementToFile, generateJSXFile, createDir, createReactProject, createVueProject, deleteFolderRecursive, modifyReactAppFile, buildReactProject }

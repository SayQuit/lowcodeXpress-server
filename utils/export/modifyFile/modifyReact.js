const fs = require('fs');
const path = require('path');


async function modifyReactFile(filePath, componentName) {
    try {
        const templateContent = fs.readFileSync(path.join(__dirname, './ReactFileTemplate.js'), 'utf8')
        const modifiedContent = templateContent.replace(`__import__`, `import ${componentName} from '../src/component/${componentName}'`).replace(`__component__`, `<${componentName}></${componentName}>`)
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
    } catch (error) {
        console.error('Error reading or modifying file:', error);
    }
}

module.exports = { modifyReactFile }

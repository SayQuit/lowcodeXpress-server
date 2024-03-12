const fs = require('fs');
const path = require('path');


async function modifyVueFile(filePath, componentName) {
    try {
        const templateContent = fs.readFileSync(path.join(__dirname, './VueFileTemplate.vue'), 'utf8')
        const modifiedContent = templateContent
            .replace(`__import__`, `import ${componentName} from '../src/components/${componentName}'`)
            .replace(`__component__`, `<${componentName}></${componentName}>`)
            .replace(`__componentName__`, componentName)
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
    } catch (error) {
        console.error('Error reading or modifying file:', error);
    }
}

module.exports = { modifyVueFile }

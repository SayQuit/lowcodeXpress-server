const { deleteDirRecursive } = require('../dir');
const { modifyReactFile } = require('./modifyReact');
const { modifyVueFile } = require('./modifyVue');
const fs = require('fs');
const path = require('path');

async function modifyFile(filePath, componentName, tech) {
   if (tech === 'react') await modifyReactFile(filePath, componentName)
   else if (tech === 'vue') await modifyVueFile(filePath, componentName)
}

async function modifyConfig(filePath, tech, name) {
   if (tech === 'vue') {
      try {
         const templateContent = fs.readFileSync(path.join(__dirname, './VuePackage.json'), 'utf8')
         fs.writeFileSync(filePath, templateContent.replace("xpress-edit-app", name), 'utf8');
      } catch (error) {
         console.error('Error reading or modifying file:', error);
      }
   }
}

module.exports = { modifyFile, modifyConfig }

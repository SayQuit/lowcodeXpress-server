const { modifyReactFile } = require('./modifyReact');


async function modifyFile(filePath, componentName,tech) {
   if(tech==='react') modifyReactFile(filePath, componentName)
//    else if(tech==='vue')
}

module.exports = { modifyFile }

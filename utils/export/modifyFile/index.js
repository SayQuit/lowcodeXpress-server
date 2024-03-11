const fs = require('fs');
const path = require('path');
const { modifyReactFile } = require('./modifyReact');


async function modifyFile(filePath, componentName) {
    modifyReactFile(filePath, componentName)
}

module.exports = { modifyFile }

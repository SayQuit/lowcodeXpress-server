const express = require('express');
const distRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const path = require('path');
const { getRandomID } = require('../../utils/randomID');
const { insertFile } = require('../../utils/sql/export/createSQL');
const { updateIsCreated } = require('../../utils/sql/export/setSQL');
const { toHyphenCase } = require('../../utils/str');
const { compressProject } = require('../../utils/zip');
const { parseElementToFile } = require('../../utils/export/elementToCode');
const { deleteDirRecursive, createDir } = require('../../utils/export/dir');
const { createProject } = require('../../utils/export/createProject');
const { generateFile } = require('../../utils/export/fileGenerator');
const { buildProject } = require('../../utils/export/buildProject');
const { modifyFile, modifyConfig } = require('../../utils/export/modifyFile');



distRouter.post('/', async (req, res) => {
    const { headers } = req;
    const { id } = req.body;
    const token = getToken(headers);

    if (!token || !id) return sendFail(res);

    try {

        const userRow = await selectUser(token);
        const { account } = userRow;
        const detailRow = await selectJSON(account, id);
        const { element, name, type, tech, lib, variable, event, props, onload } = detailRow;
        const code = await parseElementToFile(element, name, type, tech, lib, variable, event, props, onload);
        const relativePath = `../../temp/${getRandomID()}`
        const folderPath = path.join(__dirname, relativePath)
        const { fileID } = await insertFile(relativePath, name + '_build', account, 1)
        sendData(res, null)
        const componentFolader = tech === 'react' ? 'component' : 'components'
        const appName = tech === 'react' ? 'App.js' : 'App.vue'
        const buildFolderName = tech === 'react' ? 'build' : 'dist'
        await createDir(folderPath)
        await createProject(name, folderPath, tech)
        await deleteDirRecursive(path.join(folderPath, toHyphenCase(name), 'src', 'components'));
        generateFile(code, name, path.join(folderPath, toHyphenCase(name), 'src', componentFolader), tech);
        await modifyFile(path.join(folderPath, toHyphenCase(name), 'src', appName), name, tech)
        await modifyConfig(path.join(folderPath, toHyphenCase(name), 'package.json'), tech)
        await buildProject(path.join(folderPath, toHyphenCase(name)), tech)
        compressProject(path.join(folderPath, toHyphenCase(name), buildFolderName), folderPath, `${toHyphenCase(name)}_${buildFolderName}`)
        await updateIsCreated(account, fileID)
        await deleteDirRecursive(path.join(folderPath, toHyphenCase(name)));
    } catch (error) {
        console.log(error);
        sendFail(res);
    }
});

module.exports = distRouter;
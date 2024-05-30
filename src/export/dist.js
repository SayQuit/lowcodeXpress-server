const express = require('express');
const distRouter = express.Router();
const { sendFail, sendData } = require('../../utils/send');
const { getDecodeAccount } = require('../../utils/jwt');
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
const { installLib } = require('../../utils/export/libInstall');



distRouter.post('/', async (req, res) => {
    const { headers } = req;
    const { id } = req.body;
    const account = await getDecodeAccount(headers);

    if (!account || !id) return sendFail(res);

    try {

        const detailRow = await selectJSON(account, id);
        const { element, name, type, tech, lib, variable, event, props, onload } = detailRow;
        if (!['react', 'vue'].includes(tech)) return sendFail(res)
        sendData(res, null)
        const code = await parseElementToFile(element, name, type, tech, lib, variable, event, props, onload);
        const relativePath = `../../temp/${getRandomID()}`
        const folderPath = path.join(__dirname, relativePath)

        const componentFolader = tech === 'react' ? 'component' : 'components'
        const appName = tech === 'react' ? 'App.js' : 'App.vue'
        const buildFolderName = tech === 'react' ? 'build' : 'dist'

        const { fileID } = await insertFile(relativePath, name + `_${buildFolderName}`, account, 1)
        await createDir(folderPath)
        await createProject(name, folderPath, tech)
        await installLib(lib, tech, path.join(folderPath, toHyphenCase(name)))
        await deleteDirRecursive(path.join(folderPath, toHyphenCase(name), 'src', 'components'));
        generateFile(code, name, path.join(folderPath, toHyphenCase(name), 'src', componentFolader), tech);
        await modifyFile(path.join(folderPath, toHyphenCase(name), 'src', appName), name, tech)
        await modifyConfig(path.join(folderPath, toHyphenCase(name), 'package.json'), tech, name)
        await buildProject(path.join(folderPath, toHyphenCase(name)), tech)
        compressProject(path.join(folderPath, toHyphenCase(name), buildFolderName), folderPath, `${toHyphenCase(name)}_${buildFolderName}`)
        await updateIsCreated(account, fileID)
        await deleteDirRecursive(path.join(folderPath, toHyphenCase(name)));
    } catch (error) {
        sendFail(res);
    }
});

module.exports = distRouter;
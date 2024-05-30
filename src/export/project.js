const express = require('express');
const projectRouter = express.Router();
const { sendFail, sendData } = require('../../utils/send');
const { getDecodeAccount } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const path = require('path');
const { getRandomID } = require('../../utils/randomID');
const { insertFile } = require('../../utils/sql/export/createSQL');
const { updateIsCreated } = require('../../utils/sql/export/setSQL');
const { toHyphenCase } = require('../../utils/str');
const { compressProject } = require('../../utils/zip')
const { createProject } = require('../../utils/export/createProject');
const { parseElementToFile } = require('../../utils/export/elementToCode');
const { generateFile } = require('../../utils/export/fileGenerator');
const { deleteDirRecursive, createDir } = require('../../utils/export/dir');
const { modifyFile, modifyConfig } = require('../../utils/export/modifyFile');
const { installLib } = require('../../utils/export/libInstall');




projectRouter.post('/', async (req, res) => {
    const { headers } = req;
    const { id } = req.body;

    const account= await getDecodeAccount(headers)

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

        const { fileID } = await insertFile(relativePath, name, account, 0)
        await createDir(folderPath)
        await createProject(name, folderPath, tech)
        await deleteDirRecursive(path.join(folderPath, toHyphenCase(name), 'src', 'components'));
        await installLib(lib, tech, path.join(folderPath, toHyphenCase(name)))
        generateFile(code, name, path.join(folderPath, toHyphenCase(name), 'src', componentFolader), tech);
        await modifyFile(path.join(folderPath, toHyphenCase(name), 'src', appName), name, tech)
        await modifyConfig(path.join(folderPath, toHyphenCase(name), 'package.json'), tech, name)
        compressProject(path.join(folderPath, toHyphenCase(name)), folderPath, toHyphenCase(name))
        await updateIsCreated(account, fileID)
        await deleteDirRecursive(path.join(folderPath, toHyphenCase(name)));

    } catch (error) {
        sendFail(res);
    }
});

module.exports = projectRouter;
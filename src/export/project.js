const express = require('express');
const projectRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
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
const { modifyFile } = require('../../utils/export/modifyFile');




projectRouter.post('/', async (req, res) => {
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
        const { fileID } = await insertFile(relativePath, name, account, 0)
        sendData(res, null)
        await createDir(folderPath)
        await createProject(name, folderPath)
        generateFile(code, name, path.join(folderPath, toHyphenCase(name), 'src', 'component'));
        await modifyFile(path.join(folderPath, toHyphenCase(name), 'src', 'App.js'), name)
        compressProject(path.join(folderPath, toHyphenCase(name)), folderPath, toHyphenCase(name))
        await updateIsCreated(account, fileID)
        deleteDirRecursive(path.join(folderPath, toHyphenCase(name)));

    } catch (error) {
        console.log(error);
        sendFail(res);
    }
});

module.exports = projectRouter;
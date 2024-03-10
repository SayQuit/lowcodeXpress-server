const express = require('express');
const projectRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const { parseElementToFile, createReactProject, modifyReactAppFile, createDir, deleteFolderRecursive } = require('../../utils/file/index')
const { generateJSXFile } = require('../../utils/file')
const path = require('path');
const { getRandomID } = require('../../utils/randomID');
const { insertFile } = require('../../utils/sql/export/createSQL');
const { updateIsCreated } = require('../../utils/sql/export/setSQL');
const { toHyphenCase } = require('../../utils/str');
const { compressProject } = require('../../utils/zip')



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
        const folderPath = path.join(__dirname, `../../temp/${getRandomID()}`)
        const { fileID } = await insertFile(folderPath, name, account)
        sendData(res, null)
        await createDir(folderPath)
        await createReactProject(name, folderPath)
        generateJSXFile(code, name, path.join(folderPath, toHyphenCase(name), 'src', 'component'));
        await modifyReactAppFile(path.join(folderPath, toHyphenCase(name), 'src', 'App.js'), name)
        compressProject(path.join(folderPath, toHyphenCase(name)), folderPath, toHyphenCase(name))
        console.log('success');
        await updateIsCreated(account, fileID)
        deleteFolderRecursive(path.join(folderPath, toHyphenCase(name)));

    } catch (error) {
        console.log(error);
        sendFail(res);
    }
});

module.exports = projectRouter;
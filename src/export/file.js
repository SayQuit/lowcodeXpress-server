const express = require('express');
const fileRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const path = require('path');
const fs = require('fs');
const { getRandomID } = require('../../utils/randomID');
const { parseElementToFile } = require('../../utils/export/elementToCode');
const { generateFile } = require('../../utils/export/fileGenerator');
const { createDir, deleteDirRecursive } = require('../../utils/export/dir');
const { compressProject } = require('../../utils/zip');




fileRouter.post('/', async (req, res) => {
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
        await createDir(folderPath)
        await generateFile(code, name, folderPath, tech || type);
        if (['react', 'vue'].includes(tech)) {
            const suffix = tech === 'react' ? 'jsx' : 'vue'
            const filePath = path.join(folderPath, `${name}.${suffix}`);
            const sendFilePromise = () => new Promise((resolve, reject) => {
                res.set({
                    'content-type': tech === 'react' ? 'text/jsx' : 'application/javascript',
                    'Content-Disposition': `attachment; filename=${name}.${suffix}`,
                });
                res.sendFile(filePath, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            await sendFilePromise();
            fs.unlink(filePath, (err) => {
                if (!err) fs.rmdir(folderPath, () => { })
            });
        }
        else if (type === 'wechat mini program') {
            compressProject(path.join(folderPath, name), folderPath, name)
            const sendFilePromise = () => new Promise((resolve, reject) => {
                res.set({
                    'content-type': 'application/x-zip-compressed',
                    'Content-Disposition': `attachment; filename=${name}.zip`,
                });
                res.sendFile(path.join(folderPath, name + '.zip'), async (err) => {
                    if (err) reject(err);
                    else resolve();
                    await deleteDirRecursive(path.join(folderPath, name));
                    fs.unlink(path.join(folderPath, name + '.zip'), (err) => {
                        if (!err) fs.rmdir(folderPath, () => { })
                    });
                });
            });
            await sendFilePromise();
        }
        else sendFail(res)
    } catch (error) {
        sendFail(res);
    }
});

module.exports = fileRouter;
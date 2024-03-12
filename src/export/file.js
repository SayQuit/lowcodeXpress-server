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
const { createDir } = require('../../utils/export/dir');




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
        generateFile(code, name, folderPath, tech);
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
    } catch (error) {
        console.log(error);
        sendFail(res);
    }
});

module.exports = fileRouter;
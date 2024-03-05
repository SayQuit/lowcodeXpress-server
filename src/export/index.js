const express = require('express');
const exportRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const { parseElementToFile } = require('../../utils/file/index')
const { generateJSXFile } = require('../../utils/file')
const path = require('path');
const fs = require('fs');



exportRouter.post('/', async (req, res) => {
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
        generateJSXFile(code, name);
        const filePath = path.join(__dirname, '../../temp', `${name}.jsx`);
        const sendFilePromise = () => new Promise((resolve, reject) => {
            res.set({
                'content-type': 'text/jsx',
                'Content-Disposition': `attachment; filename=${name}.jsx`,
            });

            res.sendFile(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await sendFilePromise();
        fs.unlink(filePath, (err) => { });
    } catch (error) {
        sendFail(res);
    }
});

module.exports = exportRouter;
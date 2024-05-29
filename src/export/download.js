const express = require('express');
const downloadRouter = express.Router();
const { sendFail } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/export/detailSQL')
const path = require('path');
const { toHyphenCase } = require('../../utils/str');

downloadRouter.post('/', async (req, res) => {
    const { id } = req.body
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const JSONRow = await selectJSON(account, id)
        const filePath = path.join(__dirname, JSONRow.path+`/${toHyphenCase(JSONRow.name)}.zip`)
        const sendFilePromise = () => new Promise((resolve, reject) => {
            res.set({
                'content-type': 'application/x-zip-compressed',
                'Content-Disposition': `attachment; filename=${toHyphenCase(JSONRow.name)}.zip`,
            });
            res.sendFile(filePath, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        await sendFilePromise();
    } catch (error) {
        sendFail(res)
    }

});

module.exports = downloadRouter;
const express = require('express');
const downloadRouter = express.Router();
const { sendFail } = require('../../utils/send')
const { getDecodeAccount } = require('../../utils/jwt')
const { selectJSON } = require('../../utils/sql/export/detailSQL')
const path = require('path');
const { toHyphenCase } = require('../../utils/str');

downloadRouter.post('/', async (req, res) => {
    const { id } = req.body
    const { headers } = req
    const account = await getDecodeAccount(headers)
    if (!account) return sendFail(res)
    try {
        const JSONRow = await selectJSON(account, id)
        const filePath = path.join(__dirname, JSONRow.path + `/${toHyphenCase(JSONRow.name)}.zip`)
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
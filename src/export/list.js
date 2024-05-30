const express = require('express');
const listRouter = express.Router();
const { selectJSON } = require('../../utils/sql/export/listSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getDecodeAccount } = require('../../utils/jwt')

listRouter.post('/', async (req, res) => {
    const { headers } = req
    const account= await getDecodeAccount(headers)
    if (!account) return sendFail(res)
    try {
        const JSONRow = await selectJSON(account)
        const exportProjectList = JSONRow
        const list = exportProjectList.map((item) => {
            const { id, name, createAt, isCreated } = item
            return { id, name, createAt, isCreated }
        })
        sendData(res, {
            list
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = listRouter;
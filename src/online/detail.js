const express = require('express');
const detailRouter = express.Router();
const { selectJSON } = require('../../utils/sql/online/detailSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getDecodeAccount } = require('../../utils/jwt')

detailRouter.post('/', async (req, res) => {
    const { headers } = req
    const { id } = req.body
    const account= await getDecodeAccount(headers)
    if (!account || !id) return sendFail(res)
    try {
        const detailRow = await selectJSON(account, id)
        const { element, name, description, type, tech, variable, event, props, createAt, onload } = detailRow
        sendData(res, { element, name, description, type, tech, variable, event, props, createAt, onload })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = detailRouter;
const express = require('express');
const detailRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/online/detailSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

detailRouter.post('/', async (req, res) => {
    const { headers } = req
    const { id } = req.body
    const token = getToken(headers)
    if (!token || !id) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const detailRow = await selectJSON(account, id)
        const { element, name, description, type, tech, variable, event, props, createAt, onload } = detailRow
        sendData(res, { element, name, description, type, tech, variable, event, props, createAt, onload })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = detailRouter;
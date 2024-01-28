const express = require('express');
const setRouter = express.Router();
const tokenLoginSQL = require('../../utils/sql/user/tokenLoginSQL')
const setSQL = require('../../utils/sql/project/setSQL')
const { sendData, sendFail } = require('../../utils/send')
const JWT = require('../../utils/jwt')

setRouter.post('/', async (req, res) => {
    const { element, id, name, description,  type, tech, lib } = req.body
    const { headers } = req
    const token = JWT.getToken(headers)
    if (!token || !name || !description || !id || !createAt || !type || !lib) return sendFail(res)

    try {
        const userRow = await tokenLoginSQL.selectUser(token)
        const { account } = userRow
        await setSQL.updateJSON(account, element, id, name, description, type, tech, lib)
        sendData(res, null)
    } catch (error) {
        sendFail(res)
    }

});

module.exports = setRouter;
const express = require('express');
const setRouter = express.Router();
const tokenLoginSQL = require('../../utils/sql/user/tokenLoginSQL')
const setSQL = require('../../utils/sql/elementJSON/setSQL')
const sendUtil = require('../../utils/send')
const JWT = require('../../utils/jwt')

setRouter.post('/', async (req, res) => {
    const { id, json } = req.body
    const { headers } = req
    const token = JWT.getToken(headers)
    if (!token) return sendUtil.sendFail(res)

    const userRow = await tokenLoginSQL.selectUser(token)
    if (!userRow) return sendUtil.sendFail(res)

    const { account } = userRow
    const JSONRow = setSQL.updateJSON(id, json, account)
    if (!JSONRow) return sendUtil.sendFail(res)

    sendUtil.sendData(res, null)


});

module.exports = setRouter;
const express = require('express');
const tokenLoginRouter = express.Router();
const tokenLoginSQL = require('../../utils/sql/user/tokenLoginSQL')
const sendUtil = require('../../utils/send')
const JWT = require('../../utils/jwt')

tokenLoginRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = JWT.getToken(headers)
    if (!token) return sendUtil.sendFail(res)

    const row = await tokenLoginSQL.selectUser(token)
    if (!row) return sendUtil.sendFail(res)

    const { account, username } = row
    return sendUtil.sendData(res, {
        account,
        username
    })


});

module.exports = tokenLoginRouter;
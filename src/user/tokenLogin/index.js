const express = require('express');
const tokenLoginRouter = express.Router();
const tokenLoginSQL = require('../../../utils/sql/user/tokenLoginSQL')
const sendUtil = require('../../../utils/send')
const JWT = require('../../../utils/jwt/index')

tokenLoginRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = JWT.getToken(headers)
    if (!token) sendUtil.sendFail(res)
    else {
        const row = await tokenLoginSQL.selectUser(token)
        if (!row) sendUtil.sendFail(res)
        else {
            const { account, username } = row
            sendUtil.sendData(res, {
                account,
                username
            })
        }
    }

});

module.exports = tokenLoginRouter;
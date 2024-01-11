const express = require('express');
const tokenLoginRouter = express.Router();
const tokenLoginSQL = require('./tokenLoginSQL')
const sendUtil = require('../../../utils/send')
const JWT = require('../../../utils/jwt/index')

tokenLoginRouter.post('/', async (req, res) => {
    const { token } = req.body
    if (!token) sendUtil.sendFail(res)
    else {
        const expires = await JWT.checkExpires(token)
        const row = await tokenLoginSQL.selectUser(token)
        if (!row || !expires) sendUtil.sendFail(res)
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
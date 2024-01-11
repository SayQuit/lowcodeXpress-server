const express = require('express');
const loginRouter = express.Router();
const loginSQL = require('./loginSQL')
const sendUtil = require('../../../utils/send')

loginRouter.post('/', async (req, res) => {
    const { account, password } = req.body
    if (!account || !password) sendUtil.sendFail(res)
    else {
        const row = await loginSQL.selectUser(account, password)
        if (!row || row.password !== password) sendUtil.sendFail(res)
        else {
            const token = await loginSQL.updateToken(account)
            if (!token) sendUtil.sendFail(res)
            else sendUtil.sendData(res, {
                account,
                username: row.username,
                token
            })
        }
    }
});

module.exports = loginRouter;
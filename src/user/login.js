const express = require('express');
const loginRouter = express.Router();
const loginSQL = require('../../utils/sql/user/loginSQL')
const sendUtil = require('../../utils/send')

loginRouter.post('/', async (req, res) => {
    const { account, password } = req.body
    if (!account || !password) return sendUtil.sendFail(res)

    const row = await loginSQL.selectUser(account, password)
    if (!row || row.password !== password) return sendUtil.sendFail(res)

    const token = await loginSQL.updateToken(account)
    if (!token) return sendUtil.sendFail(res)

    return sendUtil.sendData(res, {
        account,
        username: row.username,
        token
    })


});

module.exports = loginRouter;
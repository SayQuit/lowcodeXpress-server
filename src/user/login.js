const express = require('express');
const loginRouter = express.Router();
const { selectUser, updateToken } = require('../../utils/sql/user/loginSQL')
const { sendFail, sendData } = require('../../utils/send')

loginRouter.post('/', async (req, res) => {
    const { account, password } = req.body
    if (!account || !password) return sendFail(res)

    const row = await selectUser(account, password)
    if (!row || row.password !== password) return sendFail(res)

    const token = await updateToken(account)
    if (!token) return sendFail(res)

    return sendData(res, {
        account,
        username: row.username,
        token
    })


});

module.exports = loginRouter;
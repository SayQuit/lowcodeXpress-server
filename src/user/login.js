const express = require('express');
const loginRouter = express.Router();
const { selectUser, updateToken } = require('../../utils/sql/user/loginSQL')
const { sendFail, sendData } = require('../../utils/send')

loginRouter.post('/', async (req, res) => {
    const { account, password } = req.body
    if (!account || !password) return sendFail(res)

    try {
        const row = await selectUser(account, password)
        const token = await updateToken(account)
        sendData(res, {
            account,
            username: row.username,
            token
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = loginRouter;
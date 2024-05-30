const express = require('express');
const tokenLoginRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getDecodeAccount } = require('../../utils/jwt')

tokenLoginRouter.post('/', async (req, res) => {
    const { headers } = req
    const account = await getDecodeAccount(headers)
    if (!account) return sendFail(res)
    try {
        const row = await selectUser(account)
        const {  username } = row
        sendData(res, {
            account,
            username
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = tokenLoginRouter;
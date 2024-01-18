const express = require('express');
const tokenLoginRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

tokenLoginRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)

    try {
        const row = await selectUser(token)
        const { account, username } = row
        sendData(res, {
            account,
            username
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = tokenLoginRouter;
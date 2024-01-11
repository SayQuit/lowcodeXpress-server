const express = require('express');
const tokenLoginRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

tokenLoginRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)

    const row = await selectUser(token)
    if (!row) return sendFail(res)

    const { account, username } = row
    return sendData(res, {
        account,
        username
    })


});

module.exports = tokenLoginRouter;
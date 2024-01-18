const express = require('express');
const getRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/project/getSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

getRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const JSONRow = selectJSON(account)
        const jsonList = await JSONRow
        sendData(res, {
            jsonList
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = getRouter;
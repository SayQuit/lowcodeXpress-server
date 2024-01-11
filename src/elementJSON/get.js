const express = require('express');
const getRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/elementJSON/getSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

getRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)

    const userRow = await selectUser(token)
    if (!userRow) return sendFail(res)

    const { account } = userRow
    const JSONRow = selectJSON(account)
    if (!JSONRow) return sendFail(res)

    const jsonList = await JSONRow
    sendData(res, {
        jsonList
    })




});

module.exports = getRouter;
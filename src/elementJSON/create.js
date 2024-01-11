const express = require('express');
const createRouter = express.Router();
const { sendFail, sendData } = require('../../utils/send')
const { getRandomID } = require('../../utils/randomID')
const { getToken } = require('../../utils/jwt')
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { insertJSON } = require('../../utils/sql/elementJSON/createSQL')

createRouter.post('/', async (req, res) => {
    const { json } = req.body
    const { headers } = req
    const token = getToken(headers)
    if (!token || !json) return sendFail(res)

    const id = getRandomID()
    const userRow = await selectUser(token)
    if (!userRow) return sendFail(res)

    const { account } = userRow
    const insertRow = await insertJSON(account, json, id)
    if (!insertRow) return sendFail(res)

    sendData(res, null)



});

module.exports = createRouter;
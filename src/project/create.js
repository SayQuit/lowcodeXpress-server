const express = require('express');
const createRouter = express.Router();
const { sendFail, sendData } = require('../../utils/send')
const { getRandomID } = require('../../utils/randomID')
const { getToken } = require('../../utils/jwt')
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { insertJSON } = require('../../utils/sql/project/createSQL')

createRouter.post('/', async (req, res) => {
    const { json, name, description } = req.body
    const { headers } = req
    const token = getToken(headers)
    if (!token || !json || !name || !description) return sendFail(res)

    try {
        const id = getRandomID()
        const userRow = await selectUser(token)
        const { account } = userRow
        await insertJSON(account, json, id, name, description)
        sendData(res, null)
    } catch (error) {
        sendFail(res)
    }

});

module.exports = createRouter;
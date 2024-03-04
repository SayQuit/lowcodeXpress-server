const express = require('express');
const createRouter = express.Router();
const { sendFail, sendData } = require('../../utils/send')
const { getRandomID } = require('../../utils/randomID')
const { getToken } = require('../../utils/jwt')
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/project/detailSQL')
const { insertJSON } = require('../../utils/sql/online/createSQL')

createRouter.post('/', async (req, res) => {
    const { id } = req.body
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const detailRow = await selectJSON(account, id)
        const { element, name, description, type, tech, variable, event, props, lib, onload } = detailRow
        const onlineID = getRandomID()
        await insertJSON(account, element, onlineID, name, description, type, tech, variable, event, props, lib, onload)
        sendData(res, { id: onlineID })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = createRouter;
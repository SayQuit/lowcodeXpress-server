const express = require('express');
const createRouter = express.Router();
const { sendFail, sendData } = require('../../utils/send')
const { getRandomID } = require('../../utils/randomID')
const { getToken } = require('../../utils/jwt')
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { insertJSON } = require('../../utils/sql/project/createSQL')

createRouter.post('/', async (req, res) => {
    const { element, name, description, type, tech, lib} = req.body
    const { headers } = req
    const token = getToken(headers)
    if (!token || !name || !description || !type || !lib) return sendFail(res)
    try {
        const id = getRandomID()
        const userRow = await selectUser(token)
        const { account } = userRow
        await insertJSON(account, element, id, name, description, type, tech, lib, [])
        sendData(res, null)
    } catch (error) {
        console.log(error);
        sendFail(res)
    }

});

module.exports = createRouter;
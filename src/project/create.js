const express = require('express');
const createRouter = express.Router();
const { sendFail, sendData } = require('../../utils/send')
const { getRandomID } = require('../../utils/randomID')
const { getDecodeAccount } = require('../../utils/jwt')
const { insertJSON } = require('../../utils/sql/project/createSQL')

createRouter.post('/', async (req, res) => {
    const { element, name, description, type, tech, lib } = req.body
    const { headers } = req
    const account= await getDecodeAccount(headers)
    if (!account || !name || !description || !type || !lib) return sendFail(res)
    try {
        const id = getRandomID()
        await insertJSON(account, element, id, name, description, type, tech, lib, [], [], [])
        sendData(res, null)
    } catch (error) {
        sendFail(res)
    }

});

module.exports = createRouter;
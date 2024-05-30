const express = require('express');
const setRouter = express.Router();
const tokenLoginSQL = require('../../utils/sql/user/tokenLoginSQL')
const setSQL = require('../../utils/sql/project/setSQL')
const { sendData, sendFail } = require('../../utils/send')
const JWT = require('../../utils/jwt')

setRouter.post('/', async (req, res) => {
    const { element, id, name, description, type, tech, lib, variable, event, props, onload } = req.body
    const { headers } = req
    const account= await JWT.getDecodeAccount(headers)
    if (!account || !name || !description || !id || !type || !lib || !variable || !event || !props) return sendFail(res)

    try {
        await setSQL.updateJSON(account, element, id, name, description, type, tech, lib, variable, event, props, onload)
        sendData(res, null)
    } catch (error) {
        sendFail(res)
    }

});

module.exports = setRouter;
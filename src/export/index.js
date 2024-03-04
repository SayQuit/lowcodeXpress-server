const express = require('express');
const exportRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { sendFail, sendData } = require('../../utils/send');
const { getToken } = require('../../utils/jwt');
const { selectJSON } = require('../../utils/sql/project/detailSQL');
const {parseElementToFile} =require('../../utils/file/index')

exportRouter.post('/', async (req, res) => {
    const { headers } = req
    const { id } = req.body
    const token = getToken(headers)
    if (!token || !id) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const detailRow = await selectJSON(account, id)
        const {  element, name, type, tech, lib, variable, event, props, onload } = detailRow
        console.log(await parseElementToFile(element, name, type, tech, lib, variable, event, props, onload));
        sendData(res,null)
    } catch (error) {
        console.log(error);
        sendFail(res)
    }

});

module.exports = exportRouter;
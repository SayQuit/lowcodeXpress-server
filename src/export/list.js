const express = require('express');
const listRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/export/listSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

listRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const JSONRow = await selectJSON(account)
        const exportProjectList = JSONRow
        const list = exportProjectList.map((item) => {
            const { id, name, createAt, isCreated } = item
            return { id, name, createAt, isCreated }
        })
        sendData(res, {
            list
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = listRouter;
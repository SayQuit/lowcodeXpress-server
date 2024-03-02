const express = require('express');
const listRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/online/listSQL')
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
        const onlineList = JSONRow
        const list = onlineList.map((item) => {
            const { createAt, id, name, description, lib, type, tech } = item
            const tags = []
            if (type) tags.push(type)
            if (tech) tags.push(tech)
            return {
                createAt,
                id,
                name,
                description,
                tags: [...tags, ...lib]
            }
        })
        sendData(res, {
            list
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = listRouter;
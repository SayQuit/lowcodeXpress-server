const express = require('express');
const listRouter = express.Router();
const { selectJSON } = require('../../utils/sql/online/listSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getDecodeAccount } = require('../../utils/jwt')

listRouter.post('/', async (req, res) => {
    const { headers } = req
    const account= await getDecodeAccount(headers)
    if (!account) return sendFail(res)
    try {
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
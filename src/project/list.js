const express = require('express');
const listRouter = express.Router();
const { selectJSON } = require('../../utils/sql/project/listSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getDecodeAccount } = require('../../utils/jwt')

listRouter.post('/', async (req, res) => {
    const { headers } = req
    const account = await getDecodeAccount(headers)
    if (!account) return sendFail(res)
    try {
        const JSONRow = await selectJSON(account)
        const  projectList  = JSONRow
        const list = projectList.map((item) => {
            const { createAt, id, name, description, type, tech, lib, lastModified } = item
            const tags = []
            if (type) tags.push(type)
            if (tech) tags.push(tech)
            return {
                createAt,
                id,
                name,
                description,
                lastModified,
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
const express = require('express');
const listRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/project/listSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

listRouter.post('/', async (req, res) => {
    const { headers } = req
    const token = getToken(headers)
    if (!token) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const JSONRow = selectJSON(account)
        const list = await JSONRow
        const projectList = list.map((item) => {
            const { createAt, id, json } = item
            const obj = JSON.parse(json)
            const { name, desc, type, tech, lib } = obj
            const tag = [type]
            if (tech) tag.push(tech)
            tag.push(...lib)
            return {
                createAt,
                id,
                name,
                desc,
                tag
            }
        })
        sendData(res, {
            projectList
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = listRouter;
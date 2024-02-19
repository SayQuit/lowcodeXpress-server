const express = require('express');
const detailRouter = express.Router();
const { selectUser } = require('../../utils/sql/user/tokenLoginSQL')
const { selectJSON } = require('../../utils/sql/project/detailSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getToken } = require('../../utils/jwt')

detailRouter.post('/', async (req, res) => {
    const { headers } = req
    const { id } = req.body
    const token = getToken(headers)
    if (!token || !id) return sendFail(res)
    try {
        const userRow = await selectUser(token)
        const { account } = userRow
        const detailRow = await selectJSON(account, id)
        const { createAt, element, name, description, type, tech, lib, lastModified, variable } = detailRow
        const tags = []
        if (type) tags.push(type)
        if (tech) tags.push(tech)
        const dragGroup = ['basic']
        if (type) dragGroup.push(type)
        if (tech) dragGroup.push(tech)
        sendData(res, {
            createAt,
            id,
            name,
            description,
            type,
            tech,
            lib,
            element,
            lastModified,
            tags: [...tags, ...lib],
            dragGroup: [...dragGroup, ...lib],
            variable
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = detailRouter;
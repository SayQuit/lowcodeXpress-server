const express = require('express');
const detailRouter = express.Router();
const { selectJSON } = require('../../utils/sql/project/detailSQL')
const { sendFail, sendData } = require('../../utils/send')
const { getDecodeAccount } = require('../../utils/jwt')

detailRouter.post('/', async (req, res) => {
    const { headers } = req
    const { id } = req.body
    const account= await getDecodeAccount(headers)
    if (!account || !id) return sendFail(res)
    try {
        const detailRow = await selectJSON(account, id)
        const { createAt, element, name, description, type, tech, lib, lastModified, variable, event, props, onload } = detailRow
        const tags = []
        if (type) tags.push(type)
        if (tech) tags.push(tech)
        let dragGroup = ['basic']
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
            variable,
            event,
            props,
            onload
        })
    } catch (error) {
        sendFail(res)
    }

});

module.exports = detailRouter;
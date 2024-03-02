const express = require('express');
const onlineRouter = express.Router();
const createRouter = require('./create');
const detailRouter = require('./detail');
const listRouter = require('./list');

onlineRouter.use('/create', createRouter)
onlineRouter.use('/detail', detailRouter)
onlineRouter.use('/list', listRouter)

module.exports = onlineRouter;

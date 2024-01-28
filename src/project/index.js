const express = require('express');
const projectRouter = express.Router();
const createRouter = require('./create');
const listRouter = require('./list');
const setRouter = require('./set');
const detailRouter = require('./detail');

projectRouter.use('/create', createRouter)
projectRouter.use('/list', listRouter)
projectRouter.use('/set', setRouter)
projectRouter.use('/detail', detailRouter)

module.exports = projectRouter;

const express = require('express');
const projectRouter = express.Router();
const createRouter = require('./create');
const listRouter = require('./list');
const setRouter = require('./set');

projectRouter.use('/create', createRouter)
projectRouter.use('/list', listRouter)
projectRouter.use('/set', setRouter)

module.exports = projectRouter;

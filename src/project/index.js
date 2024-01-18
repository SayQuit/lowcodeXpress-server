const express = require('express');
const projectRouter = express.Router();
const createRouter = require('./create');
const getRouter = require('./get');
const setRouter = require('./set');

projectRouter.use('/create', createRouter)
projectRouter.use('/get', getRouter)
projectRouter.use('/set', setRouter)

module.exports = projectRouter;

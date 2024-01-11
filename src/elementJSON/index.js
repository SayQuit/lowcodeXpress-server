const express = require('express');
const elementJSONRouter = express.Router();
const createRouter = require('./create');
const getRouter = require('./get');
const setRouter = require('./set');

elementJSONRouter.use('/create', createRouter)
elementJSONRouter.use('/get', getRouter)
elementJSONRouter.use('/set', setRouter)

module.exports = elementJSONRouter;

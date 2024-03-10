const express = require('express');
const exportRouter = express.Router();
const fileRouter = require('./file');
const projectRouter = require('./project');

exportRouter.use('/file', fileRouter)
exportRouter.use('/project', projectRouter)

module.exports = exportRouter;
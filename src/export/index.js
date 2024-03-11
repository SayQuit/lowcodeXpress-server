const express = require('express');
const exportRouter = express.Router();
const fileRouter = require('./file');
const projectRouter = require('./project');
const listRouter = require('./list');
const downloadRouter = require('./download');
const distRouter = require('./dist');

exportRouter.use('/file', fileRouter)
exportRouter.use('/project', projectRouter)
exportRouter.use('/list', listRouter)
exportRouter.use('/download', downloadRouter)
exportRouter.use('/dist', distRouter)

module.exports = exportRouter;
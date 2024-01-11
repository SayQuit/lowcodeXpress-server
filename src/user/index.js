const express = require('express');
const userRouter = express.Router();
const loginRouter = require('./login');
const tokenLoginRouter = require('./tokenLogin');
const registerRouter = require('./register');

userRouter.use('/login', loginRouter);
userRouter.use('/tokenLogin', tokenLoginRouter)
userRouter.use('/register', registerRouter)


// 导出用户路由
module.exports = userRouter;

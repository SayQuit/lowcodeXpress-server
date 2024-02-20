const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(cors());

const userRouter = require('./src/user');
const projectRouter = require('./src/project');
app.use('/user', userRouter);
app.use('/project', projectRouter);

app.get('/test', async (_, res) => {
  
  return res.send({
    msg: 'success',
    status: 200,
    data:{
      a:'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  })
});

app.listen(5507, () => {
  console.log('Server is running on localhost:5507');
});

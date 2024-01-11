const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(cors());

const userRouter = require('./src/user');
app.use('/user', userRouter);

app.listen(5507, () => {
  console.log('Server is running on localhost:5507');
});

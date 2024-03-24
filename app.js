const express = require('express');
const cors = require('cors');

const app = express();

const path = require('path');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(cors({
  exposedHeaders: ['Content-Disposition'],
}));

const userRouter = require('./src/user');
const projectRouter = require('./src/project');
const onlineRouter = require('./src/online');
const exportRouter = require('./src/export')
app.use('/user', userRouter);
app.use('/project', projectRouter);
app.use('/online', onlineRouter);
app.use('/export', exportRouter);

const latestDrawing = [{ "id": "1", "archicasca": { "url": "http://localhost:5507/1.svg", "type": "svg", "o_url": "http://localhost:5507/1.svg" }, "download_url": "http://localhost:5507/1.svg", "o_download_url": "http://localhost:5507/1.svg" }, { "id": "2", "archicasca": { "url": "http://localhost:5507/2.svg", "type": "svg", "o_url": "http://localhost:5507/2.svg" }, "download_url": "http://localhost:5507/2.svg", "o_download_url": "http://localhost:5507/2.svg" }, { "id": "3", "archicasca": { "url": "http://localhost:5507/3.svg", "type": "svg", "o_url": "http://localhost:5507/3.svg" }, "download_url": "http://localhost:5507/3.svg", "o_download_url": "http://localhost:5507/3.svg" }]
const quiz = [ { "archiId": "1", "correct": 0, "count": 0, "name": "黄埔军校", "url": "http://localhost:5507/icon1.svg" }, { "archiId": "2", "correct": 0, "count": 0, "name": "起义路", "url": "http://localhost:5507/icon1.svg" }, { "archiId": "3", "correct": 0, "count": 0, "name": "北京路", "url": "http://localhost:5507/icon1.svg" }, { "archiId": "4", "correct": 0, "count": 0, "name": "人民公园", "url": "http://localhost:5507/icon1.svg" }, ]
const drawingStatistics = [ { "archiId": "1", "name": "中山纪念堂", "painting": 120, "url": "http://localhost:5507/icon1.svg" }, { "archiId": "2", "name": "农讲所纪念馆", "painting": 130, "url": "http://localhost:5507/icon1.svg" }, { "archiId": "3", "name": "镇海楼", "painting": 460, "url": "http://localhost:5507/icon1.svg" }, { "archiId": "3", "name": "广州塔", "painting": 240, "url": "http://localhost:5507/icon1.svg" }, ]
const chartQuizCorrect = [{ "count": 0, "name": "人民公园", }, { "count": 0, "name": "镇海楼", }, { "count": 0, "name": "农讲所纪念馆", }, { "count": 0, "name": "中山纪念堂", }, { "count": 0, "name": "人民公园", },]
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // console.log(Math.floor(Math.random() * (max - min + 1)) + min);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
app.get('/test', async (_, res) => {
  const a = latestDrawing[0]
  latestDrawing[0] = latestDrawing[1]
  latestDrawing[1] = latestDrawing[2]
  latestDrawing[2] = a
  quiz.forEach((item) => {
    item.count += getRandomInt(0, 20)
  })
  drawingStatistics.forEach((item) => {
    item.painting += getRandomInt(0, 20)
  })
  chartQuizCorrect.forEach((item) => {
    item.count += getRandomInt(0, 20)
  })
  return res.send({
    msg: 'success',
    status: 200,
    data: {
      "quiz": quiz,
      "latestDrawing": {
        "count": 3452,
        "list": latestDrawing
      },
      "drawingStatistics": drawingStatistics,
      "chartQuizCorrect": chartQuizCorrect
    }
  })
});
// 提供静态文件服务
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'temp')));


app.listen(5507, () => {
  console.log('Server is running on localhost:5507');
});

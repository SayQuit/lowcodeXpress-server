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
app.get('/test', async (_, res) => {
  const a = latestDrawing[0]
  latestDrawing[0] = latestDrawing[1]
  latestDrawing[1] = latestDrawing[2]
  latestDrawing[2] = a
  return res.send({
    msg: 'success',
    status: 200,
    data: {
      "quiz": [
          {
              "archiId": "1",
              "correct": 0,
              "count": 0,
              "name": "",
              "url": ""
          },
          {
              "archiId": "2",
              "correct": 0,
              "count": 0,
              "name": "",
              "url": ""
          },
          {
              "archiId": "3",
              "correct": 0,
              "count": 0,
              "name": "",
              "url": ""
          },
          {
              "archiId": "4",
              "correct": 0,
              "count": 0,
              "name": "",
              "url": ""
          },
      ],
      "latestDrawing": {
        "count": 3452,
        "list": latestDrawing
    },
      "drawingStatistics": [
          {
              "archiId": "1",
              "name": "",
              "painting": 0,
              "url": ""
          },
          {
              "archiId": "2",
              "name": "",
              "painting": 0,
              "url": ""
          },
          {
              "archiId": "3",
              "name": "",
              "painting": 0,
              "url": ""
          },
      ],
      "chartQuizCorrect": [
          {
              "count": 0,
              "name": ""
          },
          {
              "count": 0,
              "name": ""
          },
          {
              "count": 0,
              "name": ""
          },
      ],
      "chartUses": [
          {
            "count": 0,
            "name": ""
          },
          {
            "count": 0,
            "name": ""
          },
          {
            "count": 0,
            "name": ""
          },
      ]
  }
  })
});
// 提供静态文件服务
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'temp')));


app.listen(5507, () => {
  console.log('Server is running on localhost:5507');
});

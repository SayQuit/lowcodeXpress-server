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
const quiz = [{ "archiId": "1", "correct": 0, "count": 0, "name": "黄埔军校", "url": "http://localhost:5507/icon1.svg" }, { "archiId": "2", "correct": 0, "count": 0, "name": "起义路", "url": "http://localhost:5507/icon1.svg" }, { "archiId": "3", "correct": 0, "count": 0, "name": "北京路", "url": "http://localhost:5507/icon1.svg" }, { "archiId": "4", "correct": 0, "count": 0, "name": "人民公园", "url": "http://localhost:5507/icon1.svg" },]
const drawingStatistics = [{ "archiId": "1", "name": "中山纪念堂", "painting": 0, "url": "http://localhost:5507/icon1.svg" }, { "archiId": "2", "name": "农讲所纪念馆", "painting": 0, "url": "http://localhost:5507/icon1.svg" }, { "archiId": "3", "name": "镇海楼", "painting": 0, "url": "http://localhost:5507/icon1.svg" }, { "archiId": "3", "name": "广州塔", "painting": 0, "url": "http://localhost:5507/icon1.svg" },]
const chartQuizCorrect = [{ "count": 0, "name": "人民公园", }, { "count": 0, "name": "镇海楼", }, { "count": 0, "name": "农讲所纪念馆", }, { "count": 0, "name": "中山纪念堂", }, { "count": 0, "name": "人民公园", },]
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
app.get('/test', async (_, res) => {
  const a = latestDrawing[0]
  latestDrawing[0] = latestDrawing[1]
  latestDrawing[1] = latestDrawing[2]
  latestDrawing[2] = a
  quiz.forEach((item) => {
    item.count += getRandomInt(0, 5)
  })
  drawingStatistics.forEach((item) => {
    item.painting += getRandomInt(0, 5)
  })
  chartQuizCorrect.forEach((item) => {
    item.count += getRandomInt(0, 5)
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
      "chartQuizCorrect": chartQuizCorrect,
    }
  })
});










const likeUser = [{
  id: 1,
  img: 'https://miniweb.historic-city-canton.cn/mcgz/image/avatar/1627586713226313728'
}, {
  id: 2,
  img: 'https://miniweb.historic-city-canton.cn/mcgz/image/avatar/1627624092813230080'
}]
let like = false
let likeList=['http://localhost:5507/unlike.png']
app.get('/mcgz_test', async (_, res) => {
  return res.send({
    msg: 'success',
    status: 200,
    data: {
      main: [
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/1.jfif", content: "逢源路位于广州市荔湾区，是一条呈南北走向的道路。北接龙津西路，南至多宝路，中段与宝源路相交。逢源这两个字，最易让人想到的就是左右逢源，不管做什么，左右逢源意味着面面俱到、得心应手。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/2.jfif", content: "对忠于“好意头”的广州人来说，逢源路是条极具广州特色拥有近代商业文明及传统精髓神韵的街道。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/3.jfif", content: "逢源路名称的来源，据记载源于清十三行兴盛时形成的“逢源”西关大屋住宅区。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/4.jfif", content: "逢源路的前身是清朝康熙年间建成的逢源区的逢源东街。同治以及光绪年间，随着西关地区纺织业与商业的进一步发展，多宝住宅区与逢源住宅区开始成形。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/5.jfif", content: "逢源东街、逢源西街、逢源正西街等街道开始兴旺。逢源住宅区近泮塘禾田菜地，园地颇多。逢源东街是逢源区的东界。1932年，逢源东街扩建为逢源路。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/6.jfif", content: "逢源路虽然只有660米，但短短的一段路却映射着广州的人生百态，在那些长长的麻石雨巷中走过，一道道古老的趟笼门在你眼前闪过，渐渐浮现出一幕幕回忆。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/7.jfif", content: "走进逢源路一带，便见到一座接一座的花岗石脚、水磨青砖的房舍，以及闻名中外的西关大屋。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/8.jfif", content: "以及长骑楼、趟栊门、满洲窗、木楼梯、麻石路，这些必有的相映。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/9.jfif", content: "对于老一辈的人来讲，麻石巷见证着广州的长大，广州人很多记忆都在麻石街上，麻石街的消失就意味着广州人的记忆也随之消失。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/10.jfif", content: "因为广州在民国前，河涌从居民区流过，内街遍布排水渠，在渠面上横铺花岗石板才方便行走，麻石街便是起源于这种石冚明渠。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/11.jfif", content: "麻石面略有凹凸却磨得平滑，经年累月被数代人的拖鞋、甚至赤脚走过，三轮车的胶轮碾过，每当下大雨巷里必定水浸，所幸麻石不打滑，潮湿也不长青苔。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/12.jfif", content: "城市在不断建设与发展，古老的麻石街终抵不过新时代的发展，渐渐退出人们的视线，麻石街是广府人的传统，同时也反应出一个存在的担忧，一直陪伴我们成长的麻石街会不会离去。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/13.jfif", content: "一条安静的麻石街，在记忆里成为长久存在，在夕阳西下之时万籁俱寂之际偶尔浮现。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/14.jfif", content: "沿街的老树，葱郁茂盛，伸展的枝桠相互交错，把骄阳支离成点点的余光。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/15.jfif", content: "远近驰名的西关大屋，也不都是极尽豪华的深庭大院，在那些趟栊和大木门里面，更多的只是一些简朴而实用的青砖瓦房。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/16.jfif", content: "岁月的车轮，带走了名与利，却沉淀了深厚的记忆，见证着多代人的成长，这些具有广州味的麻石街或小市民生活气色的地方，正记录着广州的岁月痕迹与变迁的沧桑。" },
      ],
      tag: ["西关环", "岭南民居"],
      title: '历史街道｜逢源路',
      avatar: 'https://miniweb.historic-city-canton.cn/mcgz/image/avatar.png',
      posterName: '名城广州',
      postAt: '2023-02-21 19:08:23 发表于 广州',
      bgrImage: 'https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/15.jfif',
      likeUser,
      likeNum: likeUser.length,
      likeList
    }
  })
});
app.get('/mcgz_like', async (_, res) => {
  like = !like
  if (like) {
    likeUser.push({
      id: 3,
      img: 'https://miniweb.historic-city-canton.cn/mcgz/image/avatar/1627635976253734912'
    })
    likeList=['http://localhost:5507/like.png']
  }
  else {
    likeUser.pop()
    likeList=['http://localhost:5507/unlike.png']
  }
  return res.send({
    msg: 'success',
    status: 200,
    data: {
      main: [
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/1.jfif", content: "逢源路位于广州市荔湾区，是一条呈南北走向的道路。北接龙津西路，南至多宝路，中段与宝源路相交。逢源这两个字，最易让人想到的就是左右逢源，不管做什么，左右逢源意味着面面俱到、得心应手。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/2.jfif", content: "对忠于“好意头”的广州人来说，逢源路是条极具广州特色拥有近代商业文明及传统精髓神韵的街道。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/3.jfif", content: "逢源路名称的来源，据记载源于清十三行兴盛时形成的“逢源”西关大屋住宅区。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/4.jfif", content: "逢源路的前身是清朝康熙年间建成的逢源区的逢源东街。同治以及光绪年间，随着西关地区纺织业与商业的进一步发展，多宝住宅区与逢源住宅区开始成形。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/5.jfif", content: "逢源东街、逢源西街、逢源正西街等街道开始兴旺。逢源住宅区近泮塘禾田菜地，园地颇多。逢源东街是逢源区的东界。1932年，逢源东街扩建为逢源路。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/6.jfif", content: "逢源路虽然只有660米，但短短的一段路却映射着广州的人生百态，在那些长长的麻石雨巷中走过，一道道古老的趟笼门在你眼前闪过，渐渐浮现出一幕幕回忆。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/7.jfif", content: "走进逢源路一带，便见到一座接一座的花岗石脚、水磨青砖的房舍，以及闻名中外的西关大屋。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/8.jfif", content: "以及长骑楼、趟栊门、满洲窗、木楼梯、麻石路，这些必有的相映。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/9.jfif", content: "对于老一辈的人来讲，麻石巷见证着广州的长大，广州人很多记忆都在麻石街上，麻石街的消失就意味着广州人的记忆也随之消失。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/10.jfif", content: "因为广州在民国前，河涌从居民区流过，内街遍布排水渠，在渠面上横铺花岗石板才方便行走，麻石街便是起源于这种石冚明渠。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/11.jfif", content: "麻石面略有凹凸却磨得平滑，经年累月被数代人的拖鞋、甚至赤脚走过，三轮车的胶轮碾过，每当下大雨巷里必定水浸，所幸麻石不打滑，潮湿也不长青苔。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/12.jfif", content: "城市在不断建设与发展，古老的麻石街终抵不过新时代的发展，渐渐退出人们的视线，麻石街是广府人的传统，同时也反应出一个存在的担忧，一直陪伴我们成长的麻石街会不会离去。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/13.jfif", content: "一条安静的麻石街，在记忆里成为长久存在，在夕阳西下之时万籁俱寂之际偶尔浮现。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/14.jfif", content: "沿街的老树，葱郁茂盛，伸展的枝桠相互交错，把骄阳支离成点点的余光。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/15.jfif", content: "远近驰名的西关大屋，也不都是极尽豪华的深庭大院，在那些趟栊和大木门里面，更多的只是一些简朴而实用的青砖瓦房。" },
        { image: "https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/16.jfif", content: "岁月的车轮，带走了名与利，却沉淀了深厚的记忆，见证着多代人的成长，这些具有广州味的麻石街或小市民生活气色的地方，正记录着广州的岁月痕迹与变迁的沧桑。" },
      ],
      tag: ["西关环", "岭南民居"],
      title: '历史街道｜逢源路',
      avatar: 'https://miniweb.historic-city-canton.cn/mcgz/image/avatar.png',
      posterName: '名城广州',
      postAt: '2023-02-21 19:08:23 发表于 广州',
      bgrImage: 'https://miniweb.historic-city-canton.cn/mcgz/image/article/2023/2/1627988599427301376/src/15.jfif',
      likeUser,
      likeNum: likeUser.length,
      likeList

    }
  })
});
// 提供静态文件服务
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'temp')));


app.listen(5507, () => {
  console.log('Server is running on localhost:5507');
});


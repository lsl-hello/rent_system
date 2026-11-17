const express = require('express');
const cors = require('cors');
const path = require('path');
const rentRouter = require('./routes/rent');
const app = express();
const port = 3000;

// 全局中间件
app.use(cors());
app.use(express.json());
// 静态托管上传图片
app.use('/upload', express.static(path.join(__dirname, 'upload')));
// 注册路由
app.use('/api', rentRouter);

app.listen(port, () => {
  console.log('后端服务启动成功：http://localhost:3000');
});
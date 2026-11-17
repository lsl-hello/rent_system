const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const pool = require('../db/db');

// 图片上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './upload/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// 1.图片上传
router.post('/upload', upload.single('img'), (req, res) => {
  if (!req.file) return res.status(400).json({ msg: '请上传图片' });
  res.json({ url: `/upload/${req.file.filename}` });
});

// 2.获取全部租赁物品
router.get('/goods', async (req, res) => {
  try {
    const [list] = await pool.query('SELECT * FROM rent_goods ORDER BY id DESC');
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: '查询失败', err });
  }
});

// 3.获取所有物品分类
router.get('/goods/types', async (req, res) => {
  const [data] = await pool.query('SELECT DISTINCT goods_type FROM rent_goods');
  const arr = data.map(item => item.goods_type);
  res.json(arr);
});

// 4.按分类筛选物品
router.get('/goods/type/:type', async (req, res) => {
  const [list] = await pool.query('SELECT * FROM rent_goods WHERE goods_type = ?', [req.params.type]);
  res.json(list);
});

// 5.根据ID查询物品详情
router.get('/goods/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM rent_goods WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ msg: '物品不存在' });
  res.json(rows[0]);
});

// 6.新增物品
router.post('/goods/add', async (req, res) => {
  const { goods_name, goods_type, img, price_day, deposit, contact, goods_desc, rent_rule, status } = req.body;
  const sql = `INSERT INTO rent_goods(goods_name,goods_type,img,price_day,deposit,contact,goods_desc,rent_rule,status) VALUES (?,?,?,?,?,?,?,?,?)`;
  await pool.query(sql, [goods_name, goods_type, img, price_day, deposit, contact, goods_desc, rent_rule, status]);
  res.json({ msg: '物品上架成功' });
});

// 7.编辑物品
router.put('/goods/edit', async (req, res) => {
  const { id, goods_name, goods_type, img, price_day, deposit, contact, goods_desc, rent_rule, status } = req.body;
  const sql = `UPDATE rent_goods SET goods_name=?,goods_type=?,img=?,price_day=?,deposit=?,contact=?,goods_desc=?,rent_rule=?,status=? WHERE id=?`;
  await pool.query(sql, [goods_name, goods_type, img, price_day, deposit, contact, goods_desc, rent_rule, status, id]);
  res.json({ msg: '修改成功' });
});

// 8.删除物品
router.delete('/goods/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM rent_goods WHERE id = ?', [req.params.id]);
  res.json({ msg: '删除成功' });
});

module.exports = router;
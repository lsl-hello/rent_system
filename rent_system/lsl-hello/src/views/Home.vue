<template>
  <div>
    <!-- 顶部轮播横幅 -->
    <el-carousel height="400px">
      <el-carousel-item>
        <div class="banner banner1">校园闲置租赁，省钱省心，随租随还</div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="banner banner2">数码/书籍/运动器材/礼服 全部可短期租赁</div>
      </el-carousel-item>
    </el-carousel>

    <div class="container list-page">
      <!-- 筛选搜索栏 -->
      <div class="filter-box">
        <el-select v-model="type" placeholder="分类筛选" @change="filterData">
          <el-option label="全部物品" value=""></el-option>
          <el-option v-for="t in typeList" :key="t" :label="t" :value="t"></el-option>
        </el-select>
        <el-input v-model="keyword" placeholder="输入物品名称搜索" class="search-input" @input="searchData"></el-input>
      </div>

      <!-- 物品卡片列表 -->
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in goodsList" :key="item.id">
          <el-card shadow="hover" class="card" @click="$router.push(`/detail/${item.id}`)">
            <img :src="`http://localhost:3000${item.img}`" class="list-img" alt="">
            <h3>{{ item.goods_name }} <el-tag size="small">{{ item.goods_type }}</el-tag></h3>
            <p class="price">日租：¥{{ item.price_day }} | 押金：¥{{ item.deposit }}</p>
            <p v-if="item.status === 0" style="color:red;">已借出</p>
            <p v-else style="color:#00b42a;">可租赁</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getGoodsList, getGoodsByType, getGoodsTypes } from '../api/axios'
const goodsList = ref([])
const type = ref('')
const keyword = ref('')
const typeList = ref([])
let allData = []

// 加载全部物品
const loadAll = async () => {
  const res = await getGoodsList()
  allData = res.data
  goodsList.value = allData
}
// 加载所有分类
const loadTypeList = async () => {
  const res = await getGoodsTypes()
  typeList.value = res.data
}

onMounted(async () => {
  await loadAll()
  await loadTypeList()
})

// 分类筛选
const filterData = async () => {
  if (!type.value) return loadAll()
  const res = await getGoodsByType(type.value)
  goodsList.value = res.data
}
// 关键词模糊搜索
const searchData = () => {
  goodsList.value = allData.filter(item => item.goods_name.includes(keyword.value))
}
</script>

<style scoped>
.banner {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #fff;
}
.banner1 {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #fff;
  background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),
  url('http://localhost:3000/upload/01.jpg') center/cover no-repeat;
}
.banner2 {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #fff;
  background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),
  url('http://localhost:3000/upload/02.jpg') center/cover no-repeat;
}
.list-page {
  margin-top: 30px;
}
.filter-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.search-input {
  width: 300px;
  margin-left: 20px;
}
.list-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  margin-bottom: 10px;
}
.price {
  color: #e74c3c;
  font-weight: bold;
  margin:6px 0;
}
</style>
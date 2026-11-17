<template>
  <div class="container detail-page" v-if="info">
    <el-row :gutter="40">
      <el-col :span="10">
        <el-image :src="`http://localhost:3000${info.img}`" fit="cover" class="detail-img"></el-image>
      </el-col>
      <el-col :span="14">
        <h1 class="title">{{ info.goods_name }}</h1>
        <el-tag>{{ info.goods_type }}</el-tag>
        <div class="info-line"><b>日租金：</b>¥{{ info.price_day }}</div>
        <div class="info-line"><b>物品押金：</b>¥{{ info.deposit }}</div>
        <div class="info-line"><b>发布人联系方式：</b>{{ info.contact }}</div>
        <div class="info-line">
          <b>租赁状态：</b>
          <el-tag v-if="info.status === 1" type="success">可租赁</el-tag>
          <el-tag v-else type="danger">已借出</el-tag>
        </div>

        <div class="desc-box">
          <h3>物品成色描述</h3>
          <p>{{ info.goods_desc }}</p>
        </div>
        <div class="rule-box">
          <h3>租赁须知规则</h3>
          <p>{{ info.rent_rule }}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getGoodsDetail } from '../api/axios'
const route = useRoute()
const info = ref(null)

const getInfo = async () => {
  const res = await getGoodsDetail(route.params.id)
  info.value = res.data
}
onMounted(getInfo)
</script>

<style scoped>
.detail-page {
  margin: 40px auto;
}
.detail-img {
  width: 100%;
  height: 450px;
}
.title {
  margin-bottom: 10px;
}
.info-line {
  font-size: 16px;
  margin: 12px 0;
}
.desc-box, .rule-box {
  margin-top: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}
h3 {
  margin-bottom: 10px;
  color: #409eff;
}
</style>
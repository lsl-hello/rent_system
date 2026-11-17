<template>
  <div class="container admin-box">
    <h2>闲置物品后台管理系统</h2>
    <div class="top-bar">
      <el-button type="primary" @click="openAddDialog">上架新物品</el-button>
    </div>

    <!-- 物品数据表格 -->
    <el-table :data="tableData" border style="width:100%;margin-top:20px;">
      <el-table-column label="ID" prop="id" width="60"></el-table-column>
      <el-table-column label="物品图片" prop="img" width="120">
        <template #default="scope">
          <el-image :src="`http://localhost:3000${scope.row.img}`" style="width:80px;height:80px" fit="cover" preview/>
        </template>
      </el-table-column>
      <el-table-column label="物品名称" prop="goods_name"></el-table-column>
      <el-table-column label="分类" prop="goods_type">
        <template #default="scope"><el-tag>{{ scope.row.goods_type }}</el-tag></template>
      </el-table-column>
      <el-table-column label="日租金" prop="price_day"></el-table-column>
      <el-table-column label="押金" prop="deposit"></el-table-column>
      <el-table-column label="租赁状态" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">可租</el-tag>
          <el-tag v-else type="danger">已借出</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="warning" @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑弹窗表单 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="920px" @close="dialogCloseReset">
      <el-form ref="formRef" :model="form" label-width="130px">
        <el-form-item label="物品名称">
          <el-input v-model="form.goods_name" placeholder="输入物品名称"></el-input>
        </el-form-item>
        <el-form-item label="物品分类">
          <el-select v-model="form.goods_type" placeholder="选择分类">
            <el-option v-for="t in typeList" :key="t" :label="t" :value="t"></el-option>
            <el-option label="其他分类" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租赁状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">可租赁</el-radio>
            <el-radio :label="0">已借出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物品图片">
          <el-upload action="" :http-request="uploadFile" list-type="picture-card" :limit="1" :disabled="isAddMode && uploadedFlag" @remove="handleRemoveImg">
            <template #default><div class="upload-text">点击上传物品图片</div></template>
          </el-upload>
        </el-form-item>
        <el-form-item label="单日租金">
          <el-input v-model="form.price_day" type="number" placeholder="如：10"></el-input>
        </el-form-item>
        <el-form-item label="物品押金">
          <el-input v-model="form.deposit" type="number" placeholder="如：100"></el-input>
        </el-form-item>
        <el-form-item label="发布人联系方式">
          <el-input v-model="form.contact" placeholder="手机号/微信"></el-input>
        </el-form-item>
        <el-form-item label="物品成色描述">
          <el-input v-model="form.goods_desc" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="租赁规则须知">
          <el-input v-model="form.rent_rule" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadImg, getGoodsList, getGoodsTypes, addGoods, editGoods, delGoods } from '../api/axios'

const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('上架新物品')
const formRef = ref(null)
const uploadedFlag = ref(false)
const typeList = ref([])
const isAddMode = ref(false)

// 表单对象
const form = ref({
  id: null,
  goods_name: '',
  goods_type: '',
  img: '',
  price_day: '',
  deposit: '',
  contact: '',
  goods_desc: '',
  rent_rule: '',
  status: 1
})

// 加载表格物品数据
const loadTable = async () => {
  const res = await getGoodsList()
  tableData.value = res.data
}
// 加载分类下拉数据
const loadTypeList = async () => {
  const res = await getGoodsTypes()
  typeList.value = res.data
}

onMounted(async () => {
  await loadTable()
  await loadTypeList()
})

// 图片上传处理
const uploadFile = async (params) => {
  const fd = new FormData()
  fd.append('img', params.file)
  const res = await uploadImg(fd)
  form.value.img = res.data.url
  uploadedFlag.value = true
  ElMessage.success('图片上传完成')
}
// 删除已上传图片
const handleRemoveImg = () => {
  form.value.img = ''
  uploadedFlag.value = false
}

// 打开新增弹窗
const openAddDialog = () => {
  dialogTitle.value = '上架新物品'
  dialogVisible.value = true
  isAddMode.value = true
  resetAllForm()
}
// 打开编辑弹窗，回填数据
const openEditDialog = (row) => {
  dialogTitle.value = '编辑物品信息'
  dialogVisible.value = true
  isAddMode.value = false
  uploadedFlag.value = false
  form.value = {...row}
}
// 关闭弹窗重置表单
const dialogCloseReset = () => {
  if (dialogTitle.value === '上架新物品') resetAllForm()
}
// 清空全部表单
const resetAllForm = () => {
  formRef.value.resetFields()
  form.value = {
    id: null,
    goods_name: '',
    goods_type: '',
    img: '',
    price_day: '',
    deposit: '',
    contact: '',
    goods_desc: '',
    rent_rule: '',
    status: 1
  }
  uploadedFlag.value = false
}

// 提交新增/编辑表单
const submitForm = async () => {
  if (!form.value.img) return ElMessage.warning('请上传物品图片')
  if (!form.value.goods_type) return ElMessage.warning('请选择物品分类')
  try {
    if (form.value.id) {
      await editGoods(form.value)
      ElMessage.success('修改成功')
    } else {
      await addGoods(form.value)
      ElMessage.success('上架成功')
    }
    dialogVisible.value = false
    loadTable()
  } catch {
    ElMessage.error('操作失败，请重试')
  }
}

// 删除物品
const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该物品？删除后数据无法恢复', '警告', {type:'warning'})
  await delGoods(row.id)
  ElMessage.success('删除成功')
  loadTable()
}
</script>

<style scoped>
.admin-box {
  margin: 40px auto;
  width: 1200px;
  background: #fff;
  padding: 30px;
  border-radius: 10px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.top-bar {
  text-align: left;
}
.upload-text {
  color: #999;
}
</style>
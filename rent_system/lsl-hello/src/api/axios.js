import axios from 'axios'
const baseUrl = 'http://localhost:3000/api'

// 获取全部物品
export function getGoodsList() {
  return axios.get(`${baseUrl}/goods`)
}
// 获取分类列表
export function getGoodsTypes() {
  return axios.get(`${baseUrl}/goods/types`)
}
// 按分类筛选
export function getGoodsByType(type) {
  return axios.get(`${baseUrl}/goods/type/${type}`)
}
// 物品详情
export function getGoodsDetail(id) {
  return axios.get(`${baseUrl}/goods/${id}`)
}
// 上传图片
export function uploadImg(formData) {
  return axios.post(`${baseUrl}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
// 新增物品
export function addGoods(data) {
  return axios.post(`${baseUrl}/goods/add`, data)
}
// 编辑物品
export function editGoods(data) {
  return axios.put(`${baseUrl}/goods/edit`, data)
}
// 删除物品
export function delGoods(id) {
  return axios.delete(`${baseUrl}/goods/delete/${id}`)
}
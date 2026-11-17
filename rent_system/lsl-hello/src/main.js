import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import './css/global.css'

const app = createApp(App)

app.config.globalProperties.$http = axios.create({
  baseURL: 'http://localhost:3000/api'
})

app.use(router)
app.use(ElementPlus)

app.mount('#app')
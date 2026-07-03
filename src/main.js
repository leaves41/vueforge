import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { setupDirectives } from './directives'
// 导入全局样式
import './assets/styles/global.scss'


const app = createApp(App)

// 使用 Pinia
app.use(createPinia())

//使用element-plus
app.use(ElementPlus)

//使用自定义指令
setupDirectives(app)

// 使用路由
app.use(router)

app.mount('#app')

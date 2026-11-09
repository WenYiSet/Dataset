import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.config.globalProperties.$BackendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
app.use(ElementPlus)
app.mount('#app')

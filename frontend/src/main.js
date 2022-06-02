import { createApp } from 'vue'
import { createPinia } from 'pinia'
import apiHandler from '@/utils/apiHandler'
import './assets/css/index.css'
import App from './App.vue'
import router from './router'


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(apiHandler, { pinia, router })

app.mount('#app')


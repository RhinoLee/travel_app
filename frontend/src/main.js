import { createApp } from 'vue'
import { createPinia } from 'pinia'
import apiHandler from '@/utils/apiHandler'
import './assets/css/index.css'
import "./utils/api/api"
import App from './App.vue'
import router from './router'


const pinia = createPinia()
const app = createApp(App)



app.use(pinia)
app.use(apiHandler, pinia)
app.use(router)

app.mount('#app')

// const $axios = app.config.globalProperties.$axios
// export { $axios }
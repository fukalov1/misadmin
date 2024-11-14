import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'

import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'

const token = getCookie('api_token')
if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`

import { ADDRESS } from './backserver';
axios.defaults.baseURL = `${ADDRESS}`;

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(CoreuiVue)
app.use(VueGoodTablePlugin);
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('VueDatePicker', VueDatePicker);

app.mount('#app')

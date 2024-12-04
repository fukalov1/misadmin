<script setup>

import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import {routes} from '../../api/routes'
import { getCookie } from '@/helpers/cookie'
import CChartBarStatistic from '../charts/CChartBarStatistic.vue';
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();

let data = ref({
  labels: [
  ],
  datasets: [
    {
      label: 'Поверки',
      backgroundColor: '#0033cc',
      data: [],
    },
  ],
})

const worker = ref(null);

onMounted(() => {
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  console.log('user', currentUser.user.id)
  if (worker.value===null)
    worker.value = currentUser.user.id
  loadData()
})

watch(worker, () => {
  // console.log('watches worker ',worker.value)
  loadData()
})


function loadData() {
  if (worker) {
        const token = getCookie('api_token')
        if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`
        axios.get(`${routes.statistic}/${worker.value}`)
          .then((resp) => {
            data.value = resp.data.data;
          });
      }
}
</script>

<template>
  <div>
    <CRow>
      <CCol sm="12">
        <label>
          Поверитель
        </label>
        <select v-model="worker" class="form-control">
          <option :value="currentUser.user.id">
            {{ currentUser.user.name }}
          </option>
          <option v-for="(item, index) in currentUser.user.slave_users" :key="index" :value="item.slave_id">
            {{ item.slave.name }}
          </option>
        </select>
      </CCol>
    </CRow>
    <br/>
    <CChartBarStatistic
       :data="data"
    />
  </div>
</template>


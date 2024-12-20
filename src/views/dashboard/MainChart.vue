<script setup>
import { CChartBar } from '@coreui/vue-chartjs'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {routes} from '../../api/routes'
import { getCookie } from '@/helpers/cookie'
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
const process = ref(false);

onMounted(() => {
  process.value = false
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  axios.post(`/api/get-statistic-total`).then((response) => {
    if (response.data.success === true) {
      data = response.data.data;
      // console.log('data', data)
    }

    process.value = true
    // console.log('Process', process)
  }).catch(error => {
    console.log('Error get record ', error)
    if (error.response.data.status===400) {
      currentUser.logout();
    }
    process.value = true
  })
  // console.log('Process', process)
})

</script>

<template>
  <div v-if="process">
    <CChartBar :data="data" />
  </div>
</template>

<script setup>
import { CChartPie } from '@coreui/vue-chartjs'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {routes} from '../../api/routes'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();

const data = ref({
  labels: ['VueJs', 'EmberJs', 'VueJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10],
    },
  ],
})
const process = ref(false);

const options = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      align: 'start',
      labels: {
        color: 'rgb(255, 99, 132)'
      }
    }
  }
}

onMounted(() => {
  loadData()
})

function loadData() {
  process.value = false
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  axios.get(`/api/v2/statistic-workers`).then((response) => {
    if (response.data.success === true) {
      data.value = response.data.data;
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
}

</script>

<template>
  <div>
    <CRow>
      <CCol :sm="5">
        <h4 id="traffic" class="card-title mb-0">Доля поверок </h4>
        <div class="small text-body-secondary">статистика по работникам за текущий месяц</div>
      </CCol>
      <CCol :sm="7" class="d-none d-md-block">
      </CCol>
    </CRow>
    <CRow>
      <CChartPie :options="options" :data="data" />
    </CRow>
  </div>
</template>

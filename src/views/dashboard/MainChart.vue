<script setup>
import { CChartBar } from '@coreui/vue-chartjs'
import { ref, onMounted } from 'vue'
import { getCookie } from '@/helpers/cookie'
import axios from "axios";
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

let filters = {
  dateRange: {
    startDate: '',
    endDate: ''
  },
  number: '',
  serialNumber: '',
  address: '',
  act_good: 1,
  act_bad: 1,
  act_brak: 0,
};

prepareFilters()

function exportExcel() {
  axios.post(`/api/export/excel/meters/${currentUser.user.id}`,
    {
      filters: filters,
    })
    .then((resp) => {
      // console.log('file', resp.data);
      let filename = resp.data.data;
      if (filename && filename !== undefined)
        window.open(`https://pin.poverkadoma.ru/get-file?filename=${filename}`, '_blank');
    });

}

function prepareFilters() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year1 = now.getMonth() === 0 ? (year - 1) : now.getFullYear()
  const month1 = now.getMonth() === 1 ? 12 : String(now.getMonth()+1 ).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  filters.dateRange['startDate'] = year1 + '-' + month1 + '-01'
  filters.dateRange['endDate'] = year + '-' + month + '-' + day
}



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
    <CRow>
      <CCol :sm="5">
        <h4 id="traffic" class="card-title mb-0">Поверки </h4>
        <div class="small text-body-secondary">общая статистика по работикам за весь период работы</div>
      </CCol>
      <CCol :sm="7" class="d-none d-md-block">
        <CButton color="primary" class="float-end" @click="exportExcel" :title="'Загрузка выгруженных поверок за текущий месяц ( '+
                filters.dateRange['startDate']+'-'+ filters.dateRange['endDate']+')'">
          <CIcon icon="cil-cloud-download" />
        </CButton>
        <CButtonGroup
          class="float-end me-3"
          role="group"
          aria-label="Basic outlined example"
        >
          <!--                  <CButton color="secondary" variant="outline">Day</CButton>-->
          <!--                  <CButton color="secondary" variant="outline" active>Month</CButton>-->
          <!--                  <CButton color="secondary" variant="outline">Year</CButton>-->
        </CButtonGroup>
      </CCol>
    </CRow>
    <CRow>
      <CChartBar :data="data" />
    </CRow>
  </div>
</template>

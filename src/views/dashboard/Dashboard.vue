<script setup>
import avatar1 from '@/assets/images/avatars/1.jpg'
import avatar2 from '@/assets/images/avatars/2.jpg'
import avatar3 from '@/assets/images/avatars/3.jpg'
import avatar4 from '@/assets/images/avatars/4.jpg'
import avatar5 from '@/assets/images/avatars/5.jpg'
import avatar6 from '@/assets/images/avatars/6.jpg'
import MainChart from './MainChart.vue'
import axios from "axios";
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();


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
</script>

<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0">Поверки</h4>
                <div class="small text-body-secondary">Январь - Октябрь 2024</div>
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
              <MainChart />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import avatar1 from '@/assets/images/avatars/1.jpg'
import avatar2 from '@/assets/images/avatars/2.jpg'
import avatar3 from '@/assets/images/avatars/3.jpg'
import avatar4 from '@/assets/images/avatars/4.jpg'
import avatar5 from '@/assets/images/avatars/5.jpg'
import avatar6 from '@/assets/images/avatars/6.jpg'
import MainChart from './MainChart.vue'
import WorkerChart from './WorkerChart.vue'
import UserParams from './UserParams.vue'
</script>

<template>
  <div>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="8">
                <MainChart />
              </CCol>
              <CCol :sm="4">
                <WorkerChart />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol :sm="12">
        <UserParams/>
      </CCol>
    </CRow>
  </div>
</template>

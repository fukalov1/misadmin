<script setup>

import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'
import SupportForm from '@/views/Support/SupportForm.vue'
import SupportList from '@/views/Support/SupportList.vue'

const currentUser = useUserStore();

const messages= ref([]);
const visible = ref(false)

function loadData() {
      const token = getCookie('api_token')
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        // console.log('Set act ', axios.defaults.baseURL, axios.defaults.headers.common.Authorization);
        axios.post(`/api/chat/get`, {})
          .then((resp) => {
            messages.value = resp.data.data;
          }).catch(error => {
          // console.log('Error get record ', error)
          if (error.response.data.status===400) {
            currentUser.logout();
          }
        })
      }
}

onMounted(() => {
  loadData()
})

</script>

<template>
  <div>
    <CForm>
      <CRow>
        <CCol sm="12">

          <CRow>
            <CCol :sm="8">
              <strong>Техническая поддержка</strong><small></small>
            </CCol>
            <CCol :sm="4">
              <CButton color="primary" @click="visible = !visible" class="mb-3 right">
                Задать вопрос
              </CButton>
            </CCol>
          </CRow>
          <CCollapse :visible="visible">
              <CRow>
                <CCol>
                  <SupportForm @refreshList="loadData"/>
                </CCol>
              </CRow>
              </CCollapse>
          <CRow>
                <CCol>
                  <SupportList :list="messages"/>
                </CCol>
              </CRow>
        </CCol>
      </CRow>
    </CForm>
  </div>
</template>

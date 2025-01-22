<script setup>

import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore()

const emit = defineEmits(['refreshList'])

const file = ref(null)

const message = ref(null)

const uploadFile = (event) => {
      const target = event.target;
      if (target && target.files) {
        file.value = target.files[0];
      }
}

const resetForm = () => {
      document.getElementById("uploadForm").reset();
      message.value = null
      file.value = null
}

const sendQuest = async () => {
      try {
        // console.log('file', file.value)
        if ((message.value===null || message.value.length < 5) && file.value===null) {
          alert('Ошибка отправки вопроса! Сообщение не может быть пустым.')
        }
        else {
          const formdata = new FormData();
          const token = getCookie('api_token')
          if (file.value) {
            formdata.append('photos[0]', file.value);
          }
          if (message.value)
            formdata.append('message', message.value);
          const endpoint = `/api/chat/send`;
          axios.defaults.headers.common.Authorization = `Bearer ${token}`
          const response = await axios.post(endpoint, formdata);
          // console.log(response.data);
          if (response.data.success) {
            alert('Вопрос успешно отправлен')
            emit('refreshList')
            resetForm()
          } else {
            alert('Ошибка отправки вопроса!')
          }
        }
      } catch (error) {
        console.error(error);
        // uploadForm.value?.reset();
        file.value = null;
      } finally {
        // form.process = true;
      }
}

</script>

<template>
  <CCard>
    <CCardBody>
      <CForm @submit.prevent="sendQuest" id="uploadForm">
        <CRow class="mb-3">
          <CCol :sm="8">
            <CFormTextarea
              label="Текст вопроса"
              placeholder="текст вопроса"
              :requared="'required'"
              v-model="message"
            />
          </CCol>
          <CCol :sm="4">
            <CFormLabel>
              Прикрепить файл
            </CFormLabel>
            <CFormInput
              type="file"
              name="file"
              id="file1"
              @change="uploadFile($event)"
              accept="image/*"
            />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol :sm="12">
          </CCol>
          <CCol :sm="4">
            <CButton type="submit" color="primary" class="mb-2">
              Отправить
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </CCardBody>
  </CCard>
</template>

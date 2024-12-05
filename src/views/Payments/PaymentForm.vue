<script setup>
import { ref,  watch } from 'vue'
import axios from 'axios'
const emit = defineEmits(['accept-data', 'approve-data', 'cancel-data'])

const  props = defineProps({
  item: {
    type: Object
  },
  columns: {
    type: Array
  }
})

const data = ref(props.item);
const show_accept = ref(false);
const show_approve = ref(false);


watch(
  data,
  (newValue, oldValue) => {
    // console.log(newValue, oldValue)
    show_accept.value = show_approve.value = false
    if (newValue.user_id>0 && newValue.time
      && newValue.address && newValue.miowner
      && newValue.date) {
      let date = new Date(newValue.date+' '+newValue.time+':00');
      if (newValue.date.length == 10 && date.getTime() < (new Date()).getTime()) {
        show_approve.value = false;
        alert('Внимание! Дата и время визита не может быть прошедшими')
      }
      else
        show_approve.value = true;
    }
    else
      show_approve.value = false;

    if (newValue.user_id>0 && newValue.status==='Новая') {
      show_accept.value = true
    }
    else
      show_accept.value = false
  },
  {deep: true}
);


function acceptData() {
  emit('accept-data', false, data)
}

function approveData() {
  emit('approve-data', false, data)
}

function cancelData() {
  emit('enableEditMode', false, null)
}

const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const file = ref(null);
const form = ref();

const uploadFile = (event) => {
  const target = event.target;
  if (target && target.files) {
    file.value = target.files[0];
  }
}

const submitFile = async () => {
  if (file.value) {
    try {
      const formdata = new FormData();
      formdata.append('file', file.value);
      const endpoint = `/api/v1/transaction/payment/${data.value.id}/upload`;
      const response = await axios.post(endpoint, formdata);
      console.log(response.data);
      if (response.data.success) {
        alert('Файл успешно передан')
      }
      else {
        alert('Ошибка передачи файла!')
      }
      emit('enableEditMode', false, null)
    } catch (error) {
      console.error(error);
      form.value?.reset();
      file.value = null;
    } finally {
    }
  }
}

</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Транзакция</strong> <small>данные</small>
        </CCardHeader>
        <CCardBody>
              <CRow class="mb-3" v-for="(column, index) in columns" :key="index">
                <input type="hidden" id="id" name="id" v-model="data.id" v-if="column.field==='id'"/>
                <CFormLabel :for="'input'+column.field" class="col-sm-2 col-form-label"  v-if="column.field!=='id' && column.showForm">
                  {{ column.label }}
                </CFormLabel>
                <CCol :sm="10" v-if="column.field!=='id' && column.showForm">

                  <CForm novalidate @submit.prevent="submitFile" v-if="column.type === 'file'">
                    <CRow>
                    <CCol :sm="10">
                    <CFormInput
                      type="file"
                      name="file"
                      @change="uploadFile($event)"
                      accept="image/*"
                      capture
                    />
                    </CCol>
                    <CCol :sm="2">
                      <CButton type="submit">Отправить</CButton>
                    </CCol>
                    </CRow>
                  </CForm>
                  <CFormInput
                    :id="'input'+column.field"
                    :name="'input'+column.field"
                    type="text"
                    :disabled="column.disabled"
                    v-model="data[column.field]"
                    v-else/>
                </CCol>
              </CRow>
              <CRow>
              <CCol :sm="6">
              </CCol>
              <CCol :sm="6">
                <CButton @click="cancelData" color="info">Закрыть</CButton>
              </CCol>
              </CRow>
        </CCardBody>
      </CCard>

    </CCol>
  </CRow>
</template>

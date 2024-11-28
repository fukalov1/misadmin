<script setup>
import { ref,  watch } from 'vue'
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
  emit('cancel-data', false, null)
}


const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>Пользователи</strong> <small>данные</small>
        </CCardHeader>
        <CCardBody>
            <CForm>
              <CRow class="mb-3" v-for="(column, index) in columns" :key="index">
                <input type="hidden" id="id" name="id" v-model="data.id" v-if="column.field==='id'"/>
                <CFormLabel :for="'input'+column.field" class="col-sm-2 col-form-label"  v-if="column.field!=='id' && column.showForm">
                  {{ column.label }}
                </CFormLabel>
                <CCol :sm="10" v-if="column.field!=='id' && column.showForm">

                  <VueDatePicker
                    locale="ru"
                    :disabled="column.disabled"
                    v-model="data[column.field]"
                    :format="format"
                    v-if="column.type==='datetime'">
                  </VueDatePicker>
                  <CFormSelect :aria-label="column.label"
                               v-else-if="column.type==='lists'"
                               v-model="data[column.field]">
                    <option v-for="(item1, indx) in column.options" :value="item1.id" :key="indx">
                      {{ item1.value }}
                    </option>
                  </CFormSelect>
                  <CFormSelect :aria-label="column.label" v-else-if="column.type==='options'" v-model="data[column.field]">
                    <option v-for="(item1, indx) in column.options" :value="item1.id" :key="indx">
                      {{ item1.value }}
                    </option>
                  </CFormSelect>
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
              <CCol :sm="4">
                <CButton color="primary" @click="acceptData" v-if="show_accept">Назначить</CButton>
                <CButton
                  v-else
                  class="btn btn-secondary">
                  Назначить
                </CButton>
              </CCol>
              <CCol :sm="4">
                <CButton @click="approveData" color="danger" v-if="show_approve">Согласовать</CButton>
                <CButton
                  v-else
                  class="btn btn-secondary">
                  Согласовать
                </CButton>
              </CCol>
              <CCol :sm="4">
                <CButton @click="cancelData" color="info">Отменить</CButton>
              </CCol>
              </CRow>
            </CForm>
        </CCardBody>
      </CCard>

    </CCol>
  </CRow>
</template>

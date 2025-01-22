<script setup>
import { ref,  watch } from 'vue'
const emit = defineEmits(['save-data', 'cancel-data'])

const  props = defineProps({
  item: {
    type: Object
  },
  columns: {
    type: Array
  }
})

const data = ref(props.item);


function saveData() {
  emit('save-data', false, data)
}

function cancelData() {
  emit('cancel-data', false, null)
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
                  <CFormCheck
                    :id="'input'+column.name"
                    v-model="data[column.field]"
                    v-else-if="column.type==='bool'"
                  />
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
                <CButton color="primary" @click="saveData">Сохранить</CButton>
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

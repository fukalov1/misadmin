<script setup>

const emit = defineEmits(['enableEditMode', 'deleteItem'])

const  props = defineProps({
  item: {
    type: Object
  },
  columns: {
    type: Array
  }
})

function saveData() {
  emit('enableEditMode', false, props.item)
}

function cancelData() {
  emit('enableEditMode', false, null)
}

function deleteData() {
  emit('deleteItem', props.item)
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
                <input type="hidden" v-model="item.id" v-if="column.field==='id'"/>
                <CFormLabel :for="'input'+column.name" class="col-sm-2 col-form-label"  v-if="column.field!=='id'">
                  {{ column.label }}
                </CFormLabel>
                <CCol :sm="10" v-if="column.field!=='id'">
                  <CFormCheck
                    :id="'input'+column.field"
                    v-model="item[column.field]"
                    v-if="column.type==='bool'"
                  />
                  <VueDatePicker
                    locale="ru"
                    :disabled="column.disabled"
                    v-model="item[column.field]"
                    v-else-if="column.type==='date'">
                  </VueDatePicker>
                  <CFormSelect :aria-label="item.label" v-else-if="column.type==='options'" v-model="item[column.field]">
                    <option v-for="(item, indx) in column.options" :value="item.id" :key="indx">
                      {{ item.value }}
                    </option>
                  </CFormSelect>
                  <CFormInput
                    :id="'input'+column.field"
                    type="text"
                    :disabled="column.disabled"
                    v-model="item[column.field]"
                    v-else/>
                </CCol>
              </CRow>
<!--              <CRow class="mb-3">-->
<!--                <CFormLabel-->
<!--                  for="inputPassword3"-->
<!--                  class="col-sm-2 col-form-label"-->
<!--                >-->
<!--                  Password-->
<!--                </CFormLabel>-->
<!--                <CCol :sm="10">-->
<!--                  <CFormInput id="inputPassword3" type="password" />-->
<!--                </CCol>-->
<!--              </CRow>-->
<!--              <fieldset class="row mb-3">-->
<!--                <legend class="col-form-label col-sm-2 pt-0">Radios</legend>-->
<!--                <CCol :sm="10">-->
<!--                  <CFormCheck-->
<!--                    id="gridRadios1"-->
<!--                    type="radio"-->
<!--                    name="gridRadios"-->
<!--                    value="option1"-->
<!--                    label="First radio"-->
<!--                    checked-->
<!--                  />-->
<!--                  <CFormCheck-->
<!--                    id="gridRadios2"-->
<!--                    type="radio"-->
<!--                    name="gridRadios"-->
<!--                    value="option2"-->
<!--                    label="Second radio"-->
<!--                  />-->
<!--                  <CFormCheck-->
<!--                    id="gridRadios3"-->
<!--                    type="radio"-->
<!--                    name="gridRadios"-->
<!--                    value="option3"-->
<!--                    label="Third disabled radio"-->
<!--                    disabled-->
<!--                  />-->
<!--                </CCol>-->
<!--              </fieldset>-->
<!--              <CRow class="mb-3">-->
<!--                <div class="col-sm-10 offset-sm-2">-->
<!--                  <CFormCheck-->
<!--                    id="gridCheck1"-->
<!--                    type="checkbox"-->
<!--                    label="Example checkbox"-->
<!--                  />-->
<!--                </div>-->
<!--              </CRow>-->
              <CRow>
              <CCol :sm="4">
              <CButton color="primary" @click="saveData">Сохранить</CButton>
              </CCol>
              <CCol :sm="4">
              <CButton @click="cancelData" color="info">Отменить</CButton>
              </CCol>
              <CCol :sm="4">
              <CButton @click="deleteData" color="danger">Удалить</CButton>
              </CCol>
              </CRow>
            </CForm>
        </CCardBody>
      </CCard>

    </CCol>
  </CRow>
</template>

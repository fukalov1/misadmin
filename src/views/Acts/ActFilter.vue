<script setup>

const emit = defineEmits(['enableFilterMode'])

const  props = defineProps({
  filters: {
    type: Array
  }
})

const format = (dates) => {
  console.log('select date ', dates[0], dates[1])
  const day1 = dates[0].getDate();
  const month1 = dates[0].getMonth() + 1;
  const year1 = dates[0].getFullYear();

  const day2 = dates[1].getDate();
  const month2 = dates[1].getMonth() + 1;
  const year2 = dates[1].getFullYear();

  return `${day1}/${month1}/${year1} - ${day2}/${month2}/${year2}`;
}

function filterData() {
  emit('enableFilterMode', false, props.filters)
}

function resetData() {
  props.filters.map(function (item) {
    item.value = '';
  })
  emit('enableFilterMode', false, props.filters)
}

</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CForm>
        <CCard class="mb-4">
        <CCardBody>
          <CRow class="mb-3" v-for="(filter, index) in filters" :key="index">
            <CFormLabel for="input" class="col-sm-2 col-form-label">
              {{ filter.label }}
            </CFormLabel>
            <CCol :sm="10">
              <CFormCheck
                :id="'input'+filter.name"
                v-model="filter.value"
                v-if="filter.type==='bool'"
              />
              <VueDatePicker
                v-model="filter.value"
                locale="ru"
                model-auto
                v-else-if="filter.type==='daterange'"
                range />
              <VueDatePicker
                locale="ru"
                v-model="filter.value"
                v-else-if="filter.type==='date'">
              </VueDatePicker>
<!--              <CFormSelect :aria-label="filter.label" v-else-if="filter.type==='options'" v-model="filter.value]">-->
<!--                <option v-for="(item, indx) in filter.options" :value="filter.id" :key="indx">-->
<!--                  {{ item.value }}-->
<!--                </option>-->
<!--              </CFormSelect>-->
              <CFormInput
                :id="'input'+filter.name"
                type="text"
                v-model="filter.value"
                v-else/>
            </CCol>
          </CRow>
          <CRow>
            <CCol :sm="4">
            <CButton color="primary" @click="filterData">Поиск</CButton>
          </CCol>
            <CCol :sm="4">
            <CButton type="reset" @click="resetData" color="info">Сбросить</CButton>
          </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      </CForm>
    </CCol>
  </CRow>
</template>

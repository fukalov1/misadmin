<script setup>

const emit = defineEmits(['enableFilterMode'])

const  props = defineProps({
  filters: {
    type: Array
  }
})

const format = (dates) => {
  console.log('select date ', dates[0], dates[1])
  let day1 = dates[0].getDate();
  day1 = day1 < 10 ? '0'+day1 : day1
  let month1 = dates[0].getMonth() + 1
  month1 = month1 < 10 ? '0'+month1 : month1
  const year1 = dates[0].getFullYear();

  let day2 = dates[1].getDate();
  day2 = day2 < 10 ? '0'+day2 : day2
  let month2 = dates[1].getMonth() + 1;
  month2 = month2 < 10 ? '0'+month2 : month2
  const year2 = dates[1].getFullYear();

  return `${day1}/${month1}/${year1} - ${day2}/${month2}/${year2}`;
}

function filterData() {
  emit('enableFilterMode', false, props.filters)
}

function resetData() {
  props.filters.map(function (item) {
    item.value = item.default;
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
            <CFormLabel :for="'input'+filter.name" class="col-sm-2 col-form-label" v-if="filter.name!=='id'">
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
                select-text="Выбрать"
                cancel-text="Закрыть"
                :format="format"
                v-else-if="filter.type==='daterange'"
                range />
              <VueDatePicker
                locale="ru"
                select-text="Выбрать"
                cancel-text="Закрыть"
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

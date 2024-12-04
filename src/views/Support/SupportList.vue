<script setup>
import { computed } from 'vue'

const  props = defineProps({
  list: {
    type: Array
  },
})

function  type_message(topic_id) {
  return topic_id ? 'Ответ' : 'Обращение'
}


</script>

<template>
  <div>
    <CCardHeader>
      <strong>Вопросы - ответы</strong><small></small>
    </CCardHeader>
    <CCardBody>
      <CRow class="mb-3">
        <CCol :sm="12">
            <CCard v-for="(item, index) in props.list" :key="index" class="mb-3">
                <CCardHeader>
                  {{ type_message(item.topic_id) }} от {{ new Date(Date.parse(item.created_at)).toLocaleDateString()  }} {{ new Date(Date.parse(item.created_at)).toLocaleTimeString()  }}
                </CCardHeader>
                <CCardBody>
                  <CRow  v-if="item.topic_id>0">
                    <CCol :sm="1"></CCol>
                    <CCol :sm="11">
                      {{ item.message }}
                    </CCol>
                  </CRow>
                  <CRow  v-else>
                    <CCol>
                      {{ item.message }}
                      <div v-for="(photo, index) in item.photos" key="index">
                        <img :src="`http://pin.poverkadoma.ru/storage-support/${photo}`" width="300" v-if="photo"/>
                      </div>
                    </CCol>
                  </CRow>
                </CCardBody>
            </CCard>
        </CCol>
      </CRow>
    </CCardBody>
  </div>
</template>

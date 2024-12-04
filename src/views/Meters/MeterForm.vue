<script setup>
import { computed } from 'vue'
import {ADDRESS} from "../../backserver";

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

const srcJpg = computed(() => {
  console.log('jpg', props.item)
  if (props.item.date) {
    let str = 'act_' + props.item.name + '.jpg';
    let date = props.item.date;
    date = date.slice(0, 7);
    date = date.replace('-', '/');
    str = str.replace('photos/', '');
    str = '/photo/' + date + '/' + str;
    return `${ADDRESS}${str}`;
  }
  else
    return null;
})

const getSrcPhoto = (meter) => {
  console.log('meter' , meter)
  if (meter) {
    let str = meter.meter_photo;
    let date = meter.date;
    date = date.slice(0, 7);
    date = date.replace('-', '/');
    str = '/preview/' + date + '/' + str;
    return `${ADDRESS}${str}`;
  }
  else
    return null;
}

</script>

<template>
  <CRow>
    <CCol :xs="12">
      <CCardHeader>
        <CRow>
          <CCol sm="11">
          </CCol>
          <CCol sm="1">
            <CButton @click="cancelData" color="info">Закрыть</CButton>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCard class="mb-4">
        <CCardHeader>
          <strong>Данные акта</strong> <small></small>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6">
              <CRow class="flex-fill">
                <h5>Поверка № {{item.number}} от {{item.date}} г. </h5>
                <br/>
              </CRow>
              <CRow>
                <CTable>
                  <CTableRow>
                    <CTableDataCell>
                      <img :src="getSrcPhoto(item)" width="90%"/>
                    </CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        <li>
                          Модификация: {{ item.siType }} Номер в Госреестре: {{ item.regNumber }}
                        </li>
                        <li>
                          Заводской номер: {{ item.serialNumber }}
                        </li>
                        <li>
                          Дата поверки: {{ new Date(Date.parse(item.created_at)).toLocaleDateString() }}
                          Действует до: {{ new Date(Date.parse(item.nextTest)).toLocaleDateString() }}
                        </li>
                        <li>
                          Методика поверки: {{ item.checkMethod }} Вода: {{ item.waterType }}
                        </li>
                        <li>
                          Помещение: {{ item.place }}
                        </li>
                        <li v-if="item.act.exported">
                          <a :href="`https://fgis.gost.ru/fundmetrology/cm/results?filter_mi_number=${item.serialNumber}&filter_org_title=МС-РЕСУРС&activeYear=${new Date(Date.parse(item.date)).getFullYear()}`" target="_blank">
                            Проверить в ФИФ
                          </a> (в электронном реестре)
                        </li>
                      </ul>
                    </CTableDataCell>
                  </CTableRow>
                </CTable>
              </CRow>
            </CCol>
            <CCol sm="6" v-if="Object.keys(item).length">
              <img :src="srcJpg"/>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

    </CCol>
  </CRow>
</template>

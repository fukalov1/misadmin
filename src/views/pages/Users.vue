<script setup>
import { ref, defineCustomElement, onMounted, watch } from 'vue'
import TableUser from '../base/TableUser.vue'
import TableUserForm from '../forms/TableUserForm.vue'
import {routes} from '../../api/routes'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'

const edit_mode = ref(false)
const current_row = ref({})
let data = ref([])
const process = ref(false);

const columns = [
  {
    label: '',
    field: 'id',
    type: 'number',
    sortable: false,
  },
  {
    label: 'ФИО',
    field: 'name',
    type: 'string'
  },
  {
    label: 'Специальность',
    field: 'speciality',
    type: 'options',
    options: listSpeciality()
  },
  {
    label: 'Активен',
    field: 'active',
    type: 'bool',
  },
  {
    label: 'Телефон',
    field: 'phone',
    type: 'phone',
  },
  {
    label: 'Дата начала',
    field: 'createdAt',
    type: 'date',
    dateInputFormat: 'yyyy-MM-dd',
    dateOutputFormat: 'yyy-MM-dd',
  },
  {
    label: 'Конверсия',
    field: 'score',
    type: 'percentage',
  },
];

onMounted(() => {
  process.value = false
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  axios.get(`${routes.service_requests}?currentPage=1&perPage=100`).then((response) => {
    if (response.data.success === true) {
      console.log('Success get records ', response.data.data)
      data = response.data.data;
    }
    else {
      data = [
        { id:1, name:"John", speciality: 1, active: true, phone: '72233355666', createdAt: null, score: 0.03343 },
        { id:2, name:"Jane", speciality: 1, active: true, phone: '72233355666', createdAt: '2011-10-31', score: 0.03343 },
        { id:3, name:"Susan", speciality: 2, active: true, phone: '72233355666', createdAt: '2011-10-30', score: 0.03343 },
        { id:4, name:"Chris", speciality: 1, active: true, phone: '72233355666', createdAt: '2011-10-11', score: 0.03343 },
        { id:5, name:"Dan", speciality: 3, active: false, phone: '72233355666', createdAt: '2011-10-21', score: 0.03343 },
        { id:6, name:"John", speciality: 4, active: true, phone: '72233355666', createdAt: '2011-10-31', score: 0.03343 },
        { id:7, name:"John", speciality: 4, active: true, phone: '72233355666', createdAt: null, score: 0.03343 },
        { id:8, name:"Jane", speciality: 5, active: true, phone: '72233355666', createdAt: '2011-10-31', score: 0.03343 },
        { id:9, name:"Susan", speciality: 1, active: true, phone: '72233355666', createdAt: '2011-10-30', score: 0.03343 },
        { id:10, name:"Chris", speciality: 5, active: true, phone: '72233355666', createdAt: '2011-10-11', score: 0.03343 },
        { id:11, name:"Dan", speciality: 4, active: false, phone: '72233355666', createdAt: '2011-10-21', score: 0.03343 },
      ];
      console.log('Record dont get', data)
    }
    process.value = true
    console.log('Process', process)
  }).catch(error => {
    console.log('Error get record ', error)
    process.value = true
  })
  console.log('Process', process)
})

function listSpeciality() {
  return [
    {id: 1, value: 'первый'},
    {id: 2, value: 'второй'},
    {id: 3, value: 'третий'},
    {id: 4, value: 'четвертый'},
    {id: 6, value: 'пятый'},
  ]
}

function changeEditMode(show, row) {
  edit_mode.value = show
  if (show)
    current_row.value = row
  if (show === false && row !== null)
    saveItem(row)
}

function saveItem(row) {
  if (Object.keys(row)) {
    current_row.value = row
    axios.post(routes.users, row).then((response) => {
      if (response.data.success === true) {
        console.log('Success record save', Object.keys(row))
      }
      else {
        console.log('Record dont save')
      }
    }).catch(error => {
      console.log('Error record save')
    })
  }
  else {
    console.log('cancel  save record')
  }
}

function deleteItem(row) {
  if (confirm('Вы точно хотите удалить запись id: '+row.id+'?')) {
    edit_mode.value = false
    current_row.value = row

    axios.delete(routes.users, row.id).then((response) => {
      if (response.data.success === true) {
        console.log('Success record delete', Object.keys(row))
      }
      else {
        console.log('Record dont delete')
      }
    }).catch(error => {
      console.log('Error record delete')
    })

  }
}

</script>

<template>
  <div v-if="process">
    <TableUser
    :editable="true"
    :rows="data"
    :columns="columns"
    @enableEditMode="changeEditMode"
    @DeleteItem="deleteItem"
    v-if="edit_mode===false">
  </TableUser>
    <TableUserForm
    v-else
    @enableEditMode="changeEditMode"
    @DeleteItem="deleteItem"
    :columns="columns"
    :item="current_row"/>
  </div>
  <div v-else>
    нет данных
  </div>
</template>

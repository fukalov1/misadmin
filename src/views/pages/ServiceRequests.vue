<script setup>
import { ref, defineCustomElement, onMounted, watch } from 'vue'
import TableUser from '../base/TableUser.vue'
import TableUserForm from '../forms/TableUserForm.vue'
import {routes} from '../../api/routes'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();

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
    label: 'Номер',
    field: 'name',
    type: 'string',
    disabled: true
  },
  {
    label: 'Дата создания',
    field: 'created_at1',
    type: 'date',
    dateInputFormat: 'yyyy-MM-dd',
    dateOutputFormat: 'yyy-MM-dd',
    disabled: true
  },
  {
    label: 'Дата визита',
    field: 'datetime',
    type: 'string',
  },
  {
    label: 'Клиент',
    field: 'miowner',
    type: 'string',
  },
  {
    label: 'Телефон',
    field: 'phone',
    type: 'phone',
  },
  {
    label: 'Город',
    field: 'city_name',
    type: 'string',
  },
  {
    label: 'Адрес',
    field: 'address',
    type: 'string',
  },
  {
    label: 'Поверитель',
    field: 'user_name',
    type: 'string',
  },
  {
    label: 'Акт',
    field: 'act_id',
    type: 'string',
    disabled: true
  },
  {
    label: 'Статус',
    field: 'status',
    type: 'string',
    disabled: true
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
      data = response.data.data;
    }

    process.value = true
    console.log('Process', process)
  }).catch(error => {
    // console.log('Error get record ', error)
    if (error.response.data.status===400) {
      currentUser.logout();
    }
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

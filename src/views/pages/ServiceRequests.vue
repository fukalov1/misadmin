<script setup>
import { ref, defineCustomElement, onMounted, watch } from 'vue'
import ServiceRequestTable from '../ServiceRequests/ServiceRequestTable.vue'
import ServiceRequestForm from '../ServiceRequests/ServiceRequestForm.vue'
import {routes} from '../../api/routes'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'
import ServiceRequestFilter from "../ServiceRequests/ServiceRequestFilter";

const currentUser = useUserStore();

const edit_mode = ref(false)
const current_row = ref({})
const currentPage = ref(1)
const currentPerPage = ref(15)

const sort = ref({})

const data = ref([])
const process = ref(false);

const columns = [
  {
    label: 'Номер',
    field: 'name',
    type: 'string',
    disabled: true,
    showForm: true
  },
  {
    label: 'Дата создания',
    field: 'created_at1',
    type: 'date',
    dateInputFormat: 'yyyy-MM-dd',
    dateOutputFormat: 'yyy-MM-dd',
    disabled: true,
    showForm: true
  },
  {
    label: 'Дата визита',
    field: dateFn,
    type: 'string',
    showForm: false
  },
  {
    label: 'Дата визита',
    field: 'date',
    type: 'datetime',
    hidden: true,
    showForm: true,
  },
  {
    label: 'Время визита',
    field: 'time',
    type: 'options',
    hidden: true,
    showForm: true,
    options: listTime()
  },
  {
    label: 'Клиент',
    field: 'miowner',
    type: 'string',
    showForm: true,
  },
  {
    label: 'Телефон',
    field: 'phone',
    type: 'phone',
    showForm: true
  },
  {
    label: 'Город',
    field: 'city_name',
    type: 'string',
    showForm: true,
    disabled: true,
  },
  {
    label: 'Адрес',
    field: 'address',
    type: 'string',
    showForm: true
  },
  {
    label: 'Поверитель',
    field: userFn,
    type: 'string',
    showForm: false
  },
  {
    label: 'Поверитель',
    field: 'user_id',
    type: 'lists',
    showForm: true,
    hidden: true,
    options: listUsers()
  },
  {
    label: 'Акт',
    field: 'act_id',
    type: 'string',
    disabled: true,
    showForm: true
  },
  {
    label: 'Статус',
    field: 'status',
    type: 'string',
    disabled: true,
    showForm: true
  },
  {
    label: 'request_status_id',
    field: 'request_status_id',
    type: 'number',
    disabled: true,
    showForm: false,
    hidden: true
  },
  {
    label: '',
    field: 'id',
    type: 'number',
    sortable: false,
  },
];

const visible = ref(false)
const filters = ref([
  {
    label: 'Период',
    name: 'dateRange',
    type: 'daterange',
    value: ['',''],
    default: ['',''],
  },
  {
    label: 'Номер заявки',
    name: 'name',
    type: 'text',
    value: null,
    default: null
  },
  {
    label: 'Клиент',
    name: 'miowner',
    type: 'text',
    value: null,
    default: null
  },
  {
    label: 'Адрес',
    name: 'address',
    type: 'text',
    value: null,
    default: null
  },
  {
    label: ' Поступила из Госуслуг',
    name: 'system_source_id',
    type: 'bool',
    value: false,
    default: false
  },
])

onMounted(() => {
  loadData();
})

function enableFilterMode() {
  // console.log('change filters ', filters)
  loadData()
}

function loadData() {
  process.value = false

  let filters_ = {
    dateRange: {
      startDate: '',
      endDate: ''
    },
    name: '',
    miowner: '',
    address: '',
    system_source_id: 1,
  };
  filters.value.forEach(function(item) {
    if (item.name==='dateRange') {
      if (item.value[0]) {
        let day = item.value[0].getDate()
        day = day < 10 ? '0'+day : day
        let month = item.value[0].getMonth()+1
        month = month < 10 ? '0'+month : month
        filters_.dateRange['startDate'] = item.value[0].getFullYear() + '-' + month + '-' + day
      }
      if (item.value[1]) {
        let day = item.value[1].getDate()
        day = day < 10 ? '0'+day : day
        let month = item.value[1].getMonth()+1
        month = month < 10 ? '0'+month : month
        filters_.dateRange['endDate'] = item.value[1].getFullYear() + '-' + month + '-' + day
      }
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='name') {
      filters_['name'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='miowner') {
      filters_['miowner'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='address') {
      filters_['address'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='system_source_id') {
      filters_['system_source_id'] = + item.value ?? 1
    }
  });
  // console.log('Apply filters', filters_)

  let dataParams = {
    currentPage: currentPage.value,
    perPage: currentPerPage.value,
    filters: filters_,
    sort: sort.value
  }

  // console.log('All params', dataParams)

  let dataJSON = getQueryString(dataParams);

  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  axios.get(`${routes.service_requests}?${dataJSON}`).then((response) => {
    if (response.data.success === true) {
      data.value = response.data.data;
      data.value.map(item => {
        if (item.user_id === null) item.user_id='0'}
      )
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

}

function getQueryString(obj, path = '') {
  return Object.entries(obj).reduce((acc, [k, v]) => (
    path && (k = `${path}[${k}]`),
    acc + (acc && '&') + (v instanceof Object
        ? getQueryString(v, k)
        : `${k}=${v}`
    )
  ), '');
}


function listTime() {
  return [
    {id: '', value:''},
    {id: '08:00', value:  '08:00'},
    {id: '09:00', value:  '09:00'},
    {id: '10:00', value: '10:00'},
    {id: '11:00', value: '11:00'},
    {id: '12:00', value: '12:00'},
    {id: '13:00', value: '13:00'},
    {id: '14:00', value: '14:00'},
    {id: '15:00', value: '15:00'},
    {id: '16:00', value: '16:00'},
    {id: '17:00', value: '17:00'},
    {id: '18:00', value: '18:00'},
    {id: '19:00', value: '19:00'},
    {id: '20:00', value: '20:00'},
    {id: '21:00', value: '21:00'}
  ]
}

function listUsers() {
  let result = currentUser.user.slave_users.map(item => { return {id: parseInt(item.slave.id), value: item.slave.name}})
  result.push({id: 0, value: 'не указан'})
  return result
}

function dateFn(row) {
  let time = row.time ?? ''
  return row.date + ' ' + time;
}

function userFn(row) {
  let user = null;
  currentUser.user.slave_users.forEach((item) => {
    if (item.slave.id == row.user_id)
      user = item.slave
  })
  if (user) {
    return user.name
  }
}

function changeEditMode(show, row) {
  if (show) {
    edit_mode.value = show
    current_row.value = row
  }
  else
    edit_mode.value = false;
  if (show === false && row !== null)
    saveItem(row)
}

function acceptData(show, row) {
  console.log('accept data', row)
  edit_mode.value = show
  if (show)
    current_row.value = row
  if (show === false && row !== null)
    saveItem('accept')
}

function approveData(show, row) {
  console.log('approve data')
  edit_mode.value = show
  if (show)
    current_row.value = row
  if (show === false && row !== null)
    saveItem('approve')
}

function saveItem(type) {
  let data = {
    id: current_row.value.id,
    user_id: current_row.value.user_id,
    date: current_row.value.date,
    time: current_row.value.time,
    miowner: current_row.value.miowner,
    count_meters: current_row.value.count_meters,
    price: current_row.value.price,
    comment: current_row.value.comment,
    phone: current_row.value.phone,
    city_id: current_row.value.city_id,
    address: current_row.value.address,
  }
  console.log('Send data', data);
  let url = `/api/v1/service-request/accept`;
  if (type == 'accept') {
    url = `/api/v1/service-request/set-status`;
    data.status = '3';
  }
  if (type == 'approve') {
    url = `/api/v1/service-request/set-status`;
    data.status = '4';
  }

  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.post(url, data)
      .then((resp) => {
        alert(resp.data.data);
        if (resp.data.success) loadData();
      })
      .catch((resp) => {
        console.log('Error save service request ', resp);
        alert('Ошибка! Заявка ' + current_row.value.name + ' не сохранена.');
      });
  }
}


function attachActServiceRequest(item, number_act)  {
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    // console.log('attachActServiceRequest', item, number_act);
    axios.post(`/api/v1/service-request/attach-act`,
      {service_request: item, number_act: number_act})
      .then((resp) => {
        alert('Прикрепление акта '+ resp.data.data);
        if (resp.data.success) loadData();
      })
      .catch((resp) => {
        console.log('Error attach act on service request ', resp);
        alert('Ошибка! Акт не прикреплен к заявке ' + item.name + '. ' + resp.data);
      });
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
  <div>
    <CButton color="primary" @click="visible = !visible" class="mb-3 right">Фильтр</CButton>
    <CRow>
      <CCol sm="12">
        <CCollapse :visible="visible">
          <ServiceRequestFilter
            @enableFilterMode="enableFilterMode"
            :filters="filters"/>
        </CCollapse>
      </CCol>
    </CRow>

    <ServiceRequestTable
    :editable="true"
    :rows="data"
    :columns="columns"
    @enableEditMode="changeEditMode"
    @DeleteItem="deleteItem"
    @attachActServiceRequest="attachActServiceRequest"
    v-if="edit_mode===false">
  </ServiceRequestTable>
    <ServiceRequestForm
    v-else
    @accept-data="acceptData"
    @approve-data="approveData"
    @cancel-data="changeEditMode"
    :columns="columns"
    :item="current_row"/>
  </div>
</template>

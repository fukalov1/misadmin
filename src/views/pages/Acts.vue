<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {routes} from '../../api/routes'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'
import ActTable from '../Acts/ActTable.vue'
import ActForm from '../Acts/ActForm.vue'
import ActFilter from "../Acts/ActFilter.vue"

const currentUser = useUserStore();

const data = ref([])
const process = ref(false);
const edit_mode = ref(false)
const current_row = ref({})
const currentPage = ref(1)
const currentPerPage = ref(10)

const columns = [
  {
    label: 'Номер',
    field: 'number_act',
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
    label: 'Дата акта',
    field: 'date',
    type: 'string',
  },
  {
    label: 'Клиент',
    field: 'miowner',
    type: 'string',
  },
  {
    label: 'Телефон',
    field: 'receipt_phone',
    type: 'phone',
  },
  {
    label: 'Тип',
    field: 'type',
    type: 'string',
  },
  {
    label: 'Адрес',
    field: 'address',
    type: 'string',
  },
  {
    label: 'Выгружено в Аршин',
    field: exportedFn,
    type: 'number',
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
    value: ['','']
  },
  {
    label: 'Номер акта',
    name: 'number',
    type: 'text',
    value: null
  },
  {
    label: 'Заводской номер СИ',
    name: 'serialNumber',
    type: 'text',
    value: null
  },
  {
    label: 'Адрес',
    name: 'address',
    type: 'text',
    value: null
  },
  {
    label: 'Пригоден',
    name: 'act_good',
    type: 'bool',
    value: 1
  },
  {
    label: 'Непригоден',
    name: 'act_bad',
    type: 'bool',
    value: 1
  },
  {
    label: 'Испорчен',
    name: 'act_brak',
    type: 'bool',
    value: 0
  },
])

onMounted(() => {
  process.value = false
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  loadData()
})

function loadData() {
  process.value = false

  let filters_ = {
    dateRange: {
      startDate: '',
      endDate: ''
    },
    number: '',
    serialNumber: '',
    address: '',
    act_good: 1,
    act_bad: 1,
    act_brak: 0,
  };
  filters.value.forEach(function(item) {
    if (item.name==='dateRange') {
      console.log('date range', typeof item.dateRange,  item.value[0])
      // const date1 = Date(item.value[0]);
      console.log('set date 1', item.value[0])
      // const day1 = item.value[0].getDate();
      // const month1 = item.value[0].getMonth() + 1;
      // const year1 = item.value[0].getFullYear();
      //
      // const day2 = item.value[1].getDate();
      // const month2 = item.value[1].getMonth() + 1;
      // const year2 = item.value[1].getFullYear();
      //
      // filters_.dateRange['startDate'] =  `${year1}-${month1}-${day1}`
      // filters_.dateRange['endDate'] = `${year2}-${month2}-${day2}`
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
    if (typeof filters_[item.name] !== "undefined" && item.name==='number') {
      filters_['number'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='serialNumber') {
      filters_['number'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='address') {
      filters_['address'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='act_good') {
      filters_['act_good'] = + item.value ?? 0
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='act_bad') {
      filters_['act_bad'] = + item.value ?? 0
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='act_brak') {
      filters_['act_brak'] = + item.value ?? 0
    }
  });
  console.log('Apply filters', filters_)

  let dataParams = {
    currentPage: currentPage.value,
    perPage: currentPerPage.value,
    filters: filters_,
    sort: {}
  }

  console.log('All params', dataParams)

  let dataJSON = getQueryString(dataParams);
  console.log(`${routes.acts}/${currentUser.user.id}?${dataJSON}`);

  axios.get(`${routes.acts}/${currentUser.user.id}?${dataJSON}`).then((response) => {
    if (response.data.success === true) {
      data.value = response.data.data;
      // console.log('data', data)
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

function exportedFn(row) {
  return row.exported===0 ? '' : 'да';
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

function changeEditMode(show, row) {
  edit_mode.value = show
  visible.value = false
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

function enableFilterMode() {
  console.log('change filters ', filters)
  loadData()
}

function changePage(page) {
  currentPage.value = page
  loadData()
}

function changePerPage(perPage) {
  currentPerPage.value = perPage
  loadData()
}

</script>

<template>
  <div>
    <CButton color="primary" @click="visible = !visible">Фильтр</CButton>
    <CCollapse :visible="visible">
      <ActFilter
        @enableFilterMode="enableFilterMode"
        :filters="filters"/>
    </CCollapse>


    <ActTable
    :editable="true"
    :rows="data"
    :columns="columns"
    @changePage="changePage"
    @changePerPage="changePerPage"
    @enableEditMode="changeEditMode"
    @DeleteItem="deleteItem"
    v-if="edit_mode===false">
  </ActTable>
    <ActForm
    v-else
    @enableEditMode="changeEditMode"
    @DeleteItem="deleteItem"
    :columns="columns"
    :item="current_row"/>
  </div>
</template>

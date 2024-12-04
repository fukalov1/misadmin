<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import {routes} from '../../api/routes'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'
import MeterTable from '../Meters/MeterTable.vue'
import MeterForm from '../Meters/MeterForm.vue'
import MeterFilter from "../Meters/MeterFilter.vue"

const currentUser = useUserStore();

const data = ref([])
const process = ref(false);
const edit_mode = ref(false)
const current_row = ref({})
const currentPage = ref(1)
const currentPerPage = ref(15)
const worker = ref(null);

const sort = ref({})

const columns = [
  {
    label: 'Номер',
    field: 'number',
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
    label: 'Тип',
    field: 'siType',
    type: 'string',
  },
  {
    label: 'Вода',
    field: 'type',
    type: 'string',
  },
  {
    label: 'Рег. №',
    field: 'regNumber',
    type: 'string',
  },
  {
    label: 'Заводской №',
    field: 'serialNumber',
    type: 'string',
  },
  {
    label: 'Методика поверки',
    field: 'checkMethod',
    type: 'string',
  },
  {
    label: 'След. поверка',
    field: 'nextTest',
    type: 'string',
  },
  {
    label: 'Заявка',
    field: 'serviceRequest',
    type: 'string',
  },
  {
    label: 'Адрес',
    field: 'address',
    type: 'string',
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
    label: 'Номер акта',
    name: 'number',
    type: 'text',
    value: null,
    default: null
  },
  {
    label: 'Заводской номер СИ',
    name: 'serialNumber',
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
    label: 'Пригоден',
    name: 'Meter_good',
    type: 'bool',
    value: true,
    default: true
  },
  {
    label: 'Непригоден',
    name: 'Meter_bad',
    type: 'bool',
    value: true,
    default: true
  },
  {
    label: 'Испорчен',
    name: 'Meter_brak',
    type: 'bool',
    value: false,
    default: false
  },
])

onMounted(() => {
  process.value = false
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  if (worker.value===null)
    worker.value = currentUser.user.id
  loadData()
})

watch(worker, () => {
  // console.log('watches worker ',worker.value)
  loadData()
})

function loadData() {
  console.log('load data')
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
    if (typeof filters_[item.name] !== "undefined" && item.name==='Meter_good') {
      filters_['Meter_good'] = + item.value ?? 0
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='Meter_bad') {
      filters_['Meter_bad'] = + item.value ?? 0
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='Meter_brak') {
      filters_['Meter_brak'] = + item.value ?? 0
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
  // console.log(`${routes.Meters}/${currentUser.user.id}?${dataJSON}`);

  data.value = [];
  axios.get(`${routes.meters}/${worker.value}?${dataJSON}`).then((response) => {
    if (response.data.success === true) {
      data.value = response.data.data;
      // console.log('data', data)
    }

    process.value = true
    // console.log('Process', process)
  }).catch(error => {
    // console.log('Error get record ', error)
    if (error.response.data.status===400) {
      currentUser.logout();
    }
    process.value = true
  })
  // console.log('Process', process)
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
  // if (show === false && row !== null)
  //   saveItem(row)
}

function deleteItem(row) {
  if (confirm('Вы точно хотите удалить : '+row.number_Meter+'?')) {
    edit_mode.value = false
    current_row.value = row
    removeMeter()
  }
}

function removeMeter(item) {
  // console.log('row', current_row.value)
    axios.delete(`${routes.Meters}/${current_row.value.id}/${current_row.value.user_id}`, {})
      .then((resp) => {
        alert(resp.data.data);
        if (resp.data.success) loadData();
      })
      .catch((error) => {
        alert('Ошибка! Акт '+item.number_Meter+' не удален. '+error.message);
      });
};


function enableFilterMode() {
  // console.log('change filters ', filters)
  loadData()
}

function changeSort(val) {
  sort.value = {}
  if (val.length > 0) {
    sort.value[val[0].field] = val[0].type
  }
  else {
    sort.value = []
  }
  // console.log('change sort')
  loadData()
}

function changePage(page) {
  currentPage.value = page
  // console.log('change page')
  loadData()
}

function changePerPage(perPage) {
  currentPerPage.value = perPage
  // console.log('change per page')
  loadData()
}

</script>

<template>
  <div>
      <CRow>
        <CCol sm="12">
          <label>
            Поверитель
          </label>
          <select v-model="worker" class="form-control">
            <option :value="currentUser.user.id">
              {{ currentUser.user.name }}
            </option>
            <option v-for="(item, index) in currentUser.user.slave_users" :key="index" :value="item.slave_id">
              {{ item.slave.name }}
            </option>
          </select>
        </CCol>
      </CRow>
    <br/>
    <CButton color="primary" @click="visible = !visible" class="mb-3 right">Фильтр</CButton>
    <CRow>
      <CCol sm="12">
    <CCollapse :visible="visible">
      <MeterFilter
        @enableFilterMode="enableFilterMode"
        :filters="filters"/>
    </CCollapse>
      </CCol>
    </CRow>

    <MeterTable
    :editable="true"
    :rows="data"
    :columns="columns"
    @changeSort="changeSort"
    @changePage="changePage"
    @changePerPage="changePerPage"
    @enableEditMode="changeEditMode"
    @DeleteItem="deleteItem"
    v-if="edit_mode===false">
  </MeterTable>
    <MeterForm
    v-else
    @enableEditMode="changeEditMode"
    @DeleteItem="deleteItem"
    :columns="columns"
    :item="current_row"/>
  </div>
</template>

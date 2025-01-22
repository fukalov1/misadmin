<script setup>
import { ref, defineCustomElement, onMounted, watch } from 'vue'
import AgentTable from '../Agents/AgentTable.vue'
import AgentForm from '../Agents/AgentForm.vue'
import {routes} from '../../api/routes'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'
import AgentFilter from "../Agents/AgentFilter";
import router from "../../router";

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
    label: 'ФИО',
    field: 'name',
    type: 'string',
    showForm: true
  },
  {
    label: 'Стоимость поверки',
    field: 'blank_price',
    type: 'string',
    showForm: true
  },
  {
    label: 'Телефон',
    field: 'phone',
    type: 'phone',
    showForm: true
  },
  {
    label: 'Email',
    field: 'email',
    type: 'string',
    showForm: true
  },
  {
    label: 'Активный',
    field: enabledFn,
    type: 'string',
    showForm: false,
  },
  {
    label: 'Активный',
    field: 'enabled',
    type: 'bool',
    hidden: true,
    showForm: true,
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
    label: 'ФИО',
    name: 'name',
    type: 'text',
    value: null,
    default: null
  },
  {
    label: 'Телефон',
    name: 'phone',
    type: 'text',
    value: null,
    default: null
  },
  {
    label: 'Email',
    name: 'email',
    type: 'text',
    value: null,
    default: null
  },
  {
    label: ' Активный',
    name: 'enabled',
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
    name: '',
    phone: '',
    enabled: '',
  };
  filters.value.forEach(function(item) {
    if (typeof filters_[item.name] !== "undefined" && item.name==='name') {
      filters_['name'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='phone') {
      filters_['miowner'] = item.value ?? ''
    }
    if (typeof filters_[item.name] !== "undefined" && item.name==='enabled') {
      filters_['address'] = item.value ?? ''
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

  axios.get(`${routes.agents}?${dataJSON}`).then((response) => {
    if (response.data.success === true) {
      data.value = response.data.data;
      data.value.map(item => {
        if (item.user_id === null) item.user_id='0'}
      )
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

function getQueryString(obj, path = '') {
  return Object.entries(obj).reduce((acc, [k, v]) => (
    path && (k = `${path}[${k}]`),
    acc + (acc && '&') + (v instanceof Object
        ? getQueryString(v, k)
        : `${k}=${v}`
    )
  ), '');
}

function enabledFn(row) {
  return row.enabled ? 'да' : '';
}

function showServiceRequest(item) {
  // console.log('showServiceRequest', item)
  router.push({name: 'Заявки агента',  params: {create_user_id: item.id}})
}

function createData() {
  current_row.value = {name: '', blank_price: 0, enabled: true, phone: ''}
  edit_mode.value = true;
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

function saveData(show, row) {
  edit_mode.value = show
  if (show)
    current_row.value = row
  if (show === false && row !== null) {
    if (current_row.value.id > 0)
      saveItem('save')
    else
      saveItem('insert')
  }
}

function saveItem(type) {
  let data = {
    id: current_row.value.id,
    name: current_row.value.name,
    blank_price: current_row.value.blank_price,
    phone: current_row.value.phone,
    email: current_row.value.email,
    enabled: current_row.value.enabled,
  }
  let url = `/api/v2/agents`;

  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
    if (type === 'save') {
      axios.post(url, data)
        .then((resp) => {
          if (resp.data.success) loadData();
        })
        .catch((resp) => {
          console.log('Error save service request ', resp);
          alert('Ошибка! Данные агента ' + current_row.value.name + ' не сохранены.');
        });
    }
    else {
      axios.put(url, data)
        .then((resp) => {
          if (resp.data.success) loadData();
        })
        .catch((resp) => {
          console.log('Error insert service request ', resp);
          alert('Ошибка! Данные агента ' + current_row.value.name + ' не добавлены.');
        });
    }
  }
}

</script>

<template>
  <div>
    <CRow>
      <CCol sm="2">
        <CButton color="primary" @click="visible = !visible" class="mb-3 right">Фильтр</CButton>
      </CCol>
      <CCol sm="8">
      </CCol>
      <CCol sm="2">
        <CButton color="info" @click="createData" class="mb-3 right">Создать агента</CButton>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCollapse :visible="visible">
          <AgentFilter
            @enableFilterMode="enableFilterMode"
            :filters="filters"/>
        </CCollapse>
      </CCol>
    </CRow>

    <AgentTable
    :editable="true"
    :rows="data"
    :columns="columns"
    @showServiceRequest="showServiceRequest"
    @enableEditMode="changeEditMode"
    @cancelAgent="cancelAgent"
    v-if="edit_mode===false">
  </AgentTable>
    <AgentForm
    v-else
    @save-data="saveData"
    @cancel-data="changeEditMode"
    :columns="columns"
    :item="current_row"/>
  </div>
</template>

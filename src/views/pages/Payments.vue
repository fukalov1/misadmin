<script setup>

import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import {routes} from '../../api/routes'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();
import PaymentTable from "@/views/Payments/PaymentTable.vue";
import PaymentForm from "@/views/Payments/PaymentForm.vue";
import PaymentFilter from "@/views/Payments/PaymentFilter.vue";
// import TablePaymentMobileHistory from "@/views/base/TablePaymentHistoryMobile.vue";

const data = ref([])
const edit_mode = ref(false)
const process = ref(false);
const current_row = ref({})
const countRows = ref(0)
const currentPage = ref(1)
const currentPerPage = ref(15)

const columns = [
  {
    label: 'Номер',
    field: 'id',
    type: 'string',
    disabled: false,
    showForm: true
  },
  {
    label: 'Сумма',
    field: 'amount',
    type: 'string',
    disabled: true,
    showForm: true
  },
  {
    label: 'Дата',
    field: 'date',
    type: 'date',
    dateInputFormat: 'yyyy-MM-dd',
    dateOutputFormat: 'dd-MM-yyyy',
    disabled: true,
    showForm: true
  },
  {
    label: 'Тип',
    field: 'type',
    type: 'string',
  },
  {
    label: 'Тип оплаты',
    field: typePayFn,
    type: 'string',
    sortable: false,
  },
  {
    label: 'Кол-во выгрузок',
    field: 'count_meters',
    type: 'string',
    disabled: true,
    showForm: true

  },
  {
    label: 'Статус',
    field: 'status',
    type: 'string',
  },
  {
    label: 'Файл',
    field: 'file',
    type: 'file',
    disabled: false,
    showForm: true
  },
  {
    label: 'Примечание',
    field: 'comment',
    type: 'string',
    sortable: false,
    disabled: true,
    showForm: true

  },
  {
    label: '',
    field: 'action',
    type: 'string',
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
  }
])

onMounted(() => {
  process.value = false
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  loadData()
})

const caption = 'История покупок поверок';


    const isMobile = computed(() => {
      return window.innerWidth <= 760 ? true : false
    })

    let sort = {};

    const showModal = async (item) => {
      current_row.value = Object.assign({}, item);
      show_modal.value = show_modal.value;
    }


function loadData() {
      const token = getCookie('api_token')
      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
        axios.post(`/api/v1/payment-history`,
          {
            currentPage: currentPage.value,
            perPage: currentPerPage.value,
            filters: filters.value,
            sort: sort.value
          })
          .then((resp) => {
            countRows.value = resp.data.count
            data.value = resp.data.data
            process.value = true
          });
      }
    }

function typePayFn(row) {
  return row.type_pay ? row.type_pay.name : ''
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

function resetData() {
   loadData();
}

const setFilters = (val) => {
      // console.log('set filters', filters);
      filters.value = val;
      currentPage.value = 1;
      loadData();
}

function changeEditMode(show, row) {
  edit_mode.value = show
  visible.value = false
  if (show)
    current_row.value = row
}

function enableFilterMode() {
  loadData()
}


</script>

<template>
  <div>
    <div v-if="currentUser.user.payer">
      <CRow>
        <CCol sm2="2">
          <router-link to="/payment">
            <CButton color="info" class="mb-2">Пополнить лимит поверок</CButton>
          </router-link>
        </CCol>
      </CRow>
<!--      <CRow>-->
<!--        <CCol sm="12">-->
<!--          <filter-transaction-->
<!--            :rows="countRows.value"-->
<!--            :id="data.id"-->
<!--            v-on:set-filters="setFilters"-->
<!--            v-on:reset-data="resetData"/>-->
<!--        </CCol>-->
<!--      </CRow>-->
      <CRow>
        <CCol sm="12">
          <PaymentTable
            :editable="true"
            :rows="data"
            :countRows="countRows"
            :columns="columns"
            @changeSort="changeSort"
            @changePage="changePage"
            @changePerPage="changePerPage"
            @enableEditMode="changeEditMode"
            v-if="edit_mode===false"/>
          <PaymentForm
            v-else
            @enableEditMode="changeEditMode"
            :columns="columns"
            :item="current_row"/>
<!--          <TablePaymentMobileHistory-->
<!--            v-else-->
<!--            :items="data.items"-->
<!--            :fields="fields"-->
<!--            :countRows="data.countRows"-->
<!--            :perPage="data.perPage"-->
<!--            @show-modal="showModal"-->
<!--            @set-per-page="setPerPage"-->
<!--            @sort-data="sortData"-->
<!--            hover-->
<!--            striped-->
<!--            border-->
<!--            small-->
<!--            fixed-->
<!--            :caption="caption"-->
<!--          />-->
        </CCol>
<!--        <payment-modal-->
<!--          v-if="data.show_modal && data.currentRow"-->
<!--          @hide-modal="data.show_modal=false"-->
<!--          :transaction="data.currentRow"></payment-modal>-->
      </CRow>
    </div>
    <div v-else>
      <h3>Просмотр платежей будет доступен после активации администратором системы</h3>
    </div>
  </div>
</template>

<script setup>

import {computed} from "vue";
import { useColorModes } from '@coreui/vue'
const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')

const { editable, rows } = defineProps(['editable', 'rows', 'columns', 'sort'])
const emit = defineEmits(['enableEditMode', 'deleteItem', 'changePage', 'changePerPage', 'changeSort'])

function  rowStyleClassFn(row) {
  if (theme.value === 'nocturnal' )
    return row.exported === 1 ? 'bg-green-dark' : '';
  else
    return row.exported === 1 ? 'bg-green' : '';
}

const theme = computed(() => {
  return colorMode.value === 'dark' ? 'nocturnal' : ''
})

function onSortChange(params) {
  emit('changeSort', params)
}

function onPageChange(params) {
  emit('changePage', params.currentPage)
}

function onPerPageChange(params) {
  emit('changePerPage',  params.currentPerPage)
}

</script>

<template>
  <div>
    <vue-good-table
      mode="remote"
      :totalRows="155"
      :columns="columns"
      :theme="theme"
      :rows="rows"
      v-on:sort-change="onSortChange"
      v-on:page-change="onPageChange"
      v-on:per-page-change="onPerPageChange"
      styleClass="vgt-table condensed striped"
      :row-style-class="rowStyleClassFn"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'name', type: 'desc'}
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
        perPage: 15,
        position: 'bottom',
        perPageDropdown: [10, 15, 50, 100, 500],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: 'след.',
        prevLabel: 'пред.',
        rowsPerPageLabel: 'Записей на стр.',
        ofLabel: 'из',
        pageLabel: 'стр', // for 'pages' mode
        allLabel: 'All'}"
    >
      <template #emptystate>
        Нет данных
      </template>
      <template #table-row="props">
        <span v-if="props.column.field == 'id' && editable">
          <CIcon icon="cil-pencil"
                 size="xl"
                 class="btn-action blue"
                 @click="$emit('enableEditMode', true, props.row)"/>
          <CIcon icon="cil-x" size="xl"
                 @click="$emit('deleteItem', props.row)"
                 class="btn-action red"
                 v-if="props.row.exported===0"
          />
        </span>
        <span v-else>
          {{props.formattedRow[props.column.field]}}
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<style>
  .btn-action {
    margin: 2px;
    border: 1px solid;
    padding: 3px;
  }
  .red {
    color: #cc0000;
  }
  .red:hover {
    color: #fff;
    background-color: #cc0000;
  }
  .blue {
    color: #0033cc;
  }
  .blue:hover {
    color: #fff;
    background-color: #0033cc;
  }
  .bg-green {
    background-color: rgba(202, 250, 187, 0.94) !important;
  }
  .bg-green-dark {
    background-color: rgba(82, 121, 70, 0.94) !important;
  }

</style>

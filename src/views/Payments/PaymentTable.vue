<script setup>

import {computed} from "vue";
import { useColorModes } from '@coreui/vue'
const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')

const { editable, rows, columns } = defineProps(['editable', 'rows', 'columns', 'countRows'])
const emit = defineEmits(['enableEditMode', 'show-modal', 'changePage', 'changePerPage', 'changeSort'])

function showCheck(item) {
  // console.log(item);
  window.open(item.link, '_blank')
}

function showBill(item) {
  window.open(`/storage/${item.file}`, '_blank')
}

function onSortChange(params) {
  emit('changeSort', params)
}

function onPageChange(params) {
  emit('changePage', params.currentPage)
}

function onPerPageChange(params) {
  // console.log('per page ', params.currentPerPage)
  emit('changePerPage',  params.currentPerPage)
}

const theme = computed(() => {
  return colorMode.value === 'dark' ? 'nocturnal' : ''
})

</script>

<template>
  <div>
    <vue-good-table
      mode="remote"
      :totalRows="countRows"
      :columns="columns"
      :rows="rows"
      :theme="theme"
      v-on:sort-change="onSortChange"
      v-on:page-change="onPageChange"
      v-on:per-page-change="onPerPageChange"
      styleClass="vgt-table condensed striped"
      :sort-options="{
        enabled: true,
        initialSortBy: {field: 'id', type: 'desc'}
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
        pageLabel: 'стр',
        allLabel: 'All'}"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'action' && editable">
           <CIcon icon="cil-image"
                  size="xl"
                  class="btn-action black"
                  v-if="props.row.status==='подтвержденная' && props.row.type==='приход'
                                        && props.row.CheckQueueId"
                  @click="showCheck(props.row)"/>
          <CIcon icon="cil-image" size="xl"
                 @click="showBill(props.row)"
                 class="btn-action black"
                 v-if="props.row.status==='подтвержденная' && props.row.type==='приход'
                      && props.row.CheckQueueId===null && props.row.file"/>
          <CIcon icon="cil-file" size="xl"
                 @click="$emit('enableEditMode', true, props.row)"
                 class="btn-action blue"
                 v-if="props.row.status==='в процессе' && props.row.type==='приход'"/>
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
  .black {
    color: #000;
  }
  .black:hover {
    color: #fff;
    background-color: #000;
  }
  .green {
    color: #88aa00;
  }
  .green:hover {
    color: #fff;
    background-color: #88aa00;
  }
  .bg-green {
    background-color: rgba(202, 250, 187, 0.94) !important;
  }

</style>

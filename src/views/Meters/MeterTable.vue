<script setup>

const { editable, rows } = defineProps(['editable', 'rows', 'columns', 'sort'])
const emit = defineEmits(['enableEditMode', 'deleteItem', 'changePage', 'changePerPage', 'changeSort'])

function  rowStyleClassFn(row) {
  return row.exported === 1 ? 'bg-green' : '';
}

function onSortChange(params) {
  emit('changeSort', params)
}

function onPageChange(params) {
  emit('changePage', params.currentPage)
}

function onPerPageChange(params) {
  emit('changePerPage',  params.currentPerPage)
}

function loadPdf(item) {
  window.open(`/data/act/pdf?id=${item.number_act}&pin=${item.pin}`, '_blank')
}

</script>

<template>
  <div>
    <vue-good-table
      mode="remote"
      :totalRows="155"
      :columns="columns"
      :rows="rows"
      v-on:sort-change="onSortChange"
      v-on:page-change="onPageChange"
      v-on:per-page-change="onPerPageChange"
      theme="dark"
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
         <CIcon icon="cib-adobe-acrobat-reader" size="xl"
                title="Загрузить PDF акта"
                v-if="props.row.type!=='испорчен'"
                @click="loadPdf(props.formattedRow)"
                class="btn-action black"/>
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

</style>

<script setup>

const { editable, rows } = defineProps(['editable', 'rows', 'columns'])
const emit = defineEmits(['enableEditMode', 'deleteItem'])

// const props = defineProps({
//   columns: {
//     type: Array,
//     required: true
//   }
// })

function  rowStyleClassFn(row) {
  return row.speciality === 1 ? 'bg-green' : '';
}

</script>

<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="rows"
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
        perPage: 10,
        position: 'bottom',
        perPageDropdown: [10, 50, 100],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: 'пред.',
        prevLabel: 'след.',
        rowsPerPageLabel: 'Записей на стр.',
        ofLabel: 'из',
        pageLabel: 'стр', // for 'pages' mode
        allLabel: 'All'}"
    >
      <template #table-row="props">
        <span v-if="props.column.field == 'id' && editable">
          <CIcon icon="cil-pencil"
                 size="xl"
                 class="btn-action blue"
                 @click="$emit('enableEditMode', true, props.formattedRow)"/>
          <CIcon icon="cil-x" size="xl"
                 @click="$emit('deleteItem', props.formattedRow)"
                 class="btn-action red"/>
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

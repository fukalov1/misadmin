<script setup>

import {computed} from "vue";
import { useColorModes } from '@coreui/vue'
const { colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')

const { editable, rows } = defineProps(['editable', 'rows', 'columns'])
const emit = defineEmits(['enableEditMode', 'cancelAgent', 'showServiceRequest'])

function  rowStyleClassFn(row) {
  // return row.enabled === 1 ? 'bg-green' : '';
}

const theme = computed(() => {
  return colorMode.value === 'dark' ? 'nocturnal' : ''
})

</script>

<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :theme="theme"
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
      <template #table-row="props">
        <span v-if="props.column.field == 'id' && editable">
          <CIcon icon="cil-pencil"
                 size="xl"
                 class="btn-action blue"
                 title="изменение агента"
                 @click="$emit('enableEditMode', true, props.formattedRow)"/>
          <CIcon icon="cil-info" size="xl"
                 title="заявки агента"
                 @click="$emit('showServiceRequest', props.row)"
                 class="btn-action green"/>
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

<script setup>

const { editable, rows } = defineProps(['editable', 'rows', 'columns'])
const emit = defineEmits(['enableEditMode', 'cancelServiceRequest', 'attachActServiceRequest'])

// const props = defineProps({
//   columns: {
//     type: Array,
//     required: true
//   }
// })

function  rowStyleClassFn(row) {
  return row.speciality === 1 ? 'bg-green' : '';
}

function loadPdf(item) {
  window.open(`/data/act/pdf?id=${item.number_act}&pin=${item.pin}`, '_blank')
}

function attachAct(item) {
  let number_act = prompt('Укажите номер акта, который хотите привязать к заявке','')
  if (number_act!=='')
    emit('attachActServiceRequest', item, number_act)
  else
    alert('Ошибка! Номер акта не может быть пустым.')
}

function cancelServiceRequest(item) {
  let comment = prompt('Укажите причину отмены заявки','')
  if (comment!=='')
    emit('cancelServiceRequest', item, comment)
  else
    alert('Ошибка! Не указана причина отмены заявки.')
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
                 title="изменение заявки"
                 v-if="props.row.request_status_id < 5"
                 @click="$emit('enableEditMode', true, props.formattedRow)"/>
          <CIcon icon="cil-airplay" size="xl"
                 title="прикрепить акт к заявке"
                 v-if="props.row.number_act===null && props.row.status == 'Согласована'"
                 @click="attachAct(props.row)"
                 class="btn-action green"/>
          <CIcon icon="cib-adobe-acrobat-reader" size="xl"
                 title="Загрузить PDF акта"
                 v-if="props.row.type!=='испорчен' && props.row.request_status_id > 4  && props.row.request_status_id < 8"
                 @click="loadPdf(props.formattedRow)"
                 class="btn-action black"/>
          <CIcon icon="cil-x" size="xl"
                 title="отмена заявки"
                 v-if="!!props.row.act_id===false
                       && (props.row.request_status_id === 2 || props.row.request_status_id === 3 ||
                       props.row.request_status_id === 4)"
                 @click="cancelServiceRequest(props.row)"
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

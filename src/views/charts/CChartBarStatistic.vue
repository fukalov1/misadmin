<template>
  <CChartBar
    height="400" width="1100"
    :data="data"
  />
</template>

<script>
import { CChartBar } from '@coreui/vue-chartjs'


export default {
  name: 'CChartBarStatistic',
  components: { CChartBar },
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array
    },
  },
  computed: {
    defaultDatasets () {
      return [
        {
          label: this.title,
          backgroundColor: '#f87979',
          data: []
        }
      ]
    }
  }
}
</script>

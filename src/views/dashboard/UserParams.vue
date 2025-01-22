<script setup>
import {computed, ref} from 'vue'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();

const all_meters = computed(() => {
  return currentUser.user.partner.limit_credit + currentUser.user.partner.count_meters
})

</script>

<template>
  <div>
    <CRow v-if="currentUser.user.check_online" >
      <CCol sm="6">
        <label>Онлайн-касса:&nbsp;</label>
        <strong>
          включена
        </strong>
      </CCol>
      <CCol sm="6">
        <label>Лимит про чекам:&nbsp;</label>
        <strong>
          {{ currentUser.user.partner.limit }} руб.
        </strong>
      </CCol>
    </CRow>
    <CRow v-if="currentUser.user.partner.billing">
      <CCol sm="6">
        <label>Биллинг:&nbsp;</label>
        <strong>
          включен
        </strong>
      </CCol>
      <CCol sm="6">
        <label>Кредитный лимит выгрузок:&nbsp;</label>
        <strong>
          <router-link to="/payment" v-if="currentUser.user.partner.limit_credit < 0">
            {{ currentUser.user.partner.limit_credit }}
          </router-link>
          <span v-else>
            {{ currentUser.user.partner.limit_credit }}
          </span>
          (остаток {{ all_meters }})
        </strong>
      </CCol>
    </CRow>
  </div>
</template>

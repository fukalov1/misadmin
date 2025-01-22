<script setup>
import avatar from '@/assets/images/avatars/noname.jpg'
import router from '@/router'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();

function logout() {
  currentUser.logout();
}

</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        Аккаунт
      </CDropdownHeader>
      <CDropdownItem @click="router.push('/profile')"> <CIcon icon="cil-user"/> Профиль </CDropdownItem>
<!--      <CDropdownItem> <CIcon icon="cil-settings" /> Настройки </CDropdownItem>-->
      <CDropdownDivider />
<!--      <CDropdownItem> <CIcon icon="cil-shield-alt" /> Lock Account </CDropdownItem>-->
      <CDropdownItem @click="logout"> <CIcon icon="cil-lock-locked" /> Logout </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

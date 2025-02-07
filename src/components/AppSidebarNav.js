import {computed, defineComponent, h, onMounted, onUpdated, ref, resolveComponent} from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'

// import { useUserStore } from '@/stores/user.js'

let roles = null;

import nav from '@/_nav.js'
const nav_filtered = ref(nav)

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

roles = JSON.parse(localStorage.getItem('user_roles'))
console.log('Roles is app side bar nav! ', roles)
fillNavFiltered()
console.log('Nav filtered ', nav_filtered.value)

function fillNavFiltered() {
  nav_filtered.value = nav.filter((item) => {
    if (item.to === '/agent-service-requests')
      item.to = item.to + '/'+localStorage.getItem('user_id')
    if (roles && checkRoles(roles, item.roles))
      return item
  })
}

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}


// console.log('nav filtered ', nav_filtered)

function checkRoles(arr1, arr2) {
  // console.log('arr1 ', arr1,'arr2 ', arr2)
  const leastArr = arr1.length < arr2.length ? arr1 : arr2;
  const biggestArr = arr1.length >= arr2.length ? arr1 : arr2;

  const resultArray = leastArr.filter((item) => {
    return biggestArr.some((item2) => item2.id === item.id)
  });

  return resultArray.length ? true : false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted(() => {
      firstRender.value = false
      roles = JSON.parse(localStorage.getItem('user_roles'))
      // console.log('Roles is app side bar nav mounted ', roles)
    })

    setTimeout(fillRoles, 500);

    function fillRoles() {
      roles = JSON.parse(localStorage.getItem('user_roles'))
      // console.log('Roles is app side bar nav updated ', roles)
      nav_filtered.value = nav.filter((item) => {
        if (item.to === '/agent-service-requests')
          item.to = item.to + '/'+localStorage.getItem('user_id')
        if (roles && checkRoles(roles, item.roles))
          return item
      })
    }

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    as: 'div',
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon',
                            name: item.icon,
                          })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
            },
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
        },
        {
          default: () => nav_filtered.value.map((item) => renderItem(item)),
        },
      )
  },
})

export { AppSidebarNav }

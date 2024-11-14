export default [
  {
    component: 'CNavItem',
    name: 'Главная',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'Дашборды',
  },
  {
    component: 'CNavItem',
    name: 'Конверсия',
    to: '/theme/colors',
    icon: 'cil-notes',
  },
  {
    component: 'CNavItem',
    name: 'Выручка',
    to: '/theme/typography',
    icon: 'cil-dollar',
  },
  {
    component: 'CNavItem',
    name: 'Продажи',
    to: '/theme/typography',
    icon: 'cil-graph',
  },
  {
    component: 'CNavItem',
    name: 'Первичные пациенты',
    to: '/theme/typography',
    icon: 'cil-user',
  },
  {
    component: 'CNavItem',
    name: 'Операторы',
    to: '/theme/typography',
    icon: 'cil-phone',
  },
  {
    component: 'CNavTitle',
    name: 'Администрирование',
  },
  {
    component: 'CNavItem',
    name: 'Пользователи',
    to: '/users',
    icon: 'cil-people',
  },
  {
    component: 'CNavGroup',
    name: 'Справочники',
    to: '/base',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Филиалы',
        to: '/base/accordion',
      },
      {
        component: 'CNavItem',
        name: 'Врачи',
        to: '/base/breadcrumbs',
      },
    ],
  },
]

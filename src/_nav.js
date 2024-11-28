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
    component: 'CNavItem',
    name: 'Заявки диспетчера',
    to: '/service-requests',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Акты',
    to: '/acts',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Поверки',
    to: '/users',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Статистика',
    to: '/users',
    icon: 'cil-people',
  },
  {
    component: 'CNavItem',
    name: 'Профиль',
    to: '/users',
    icon: 'cil-people',
  },
  {
    component: 'CNavGroup',
    name: 'Справочники',
    to: '/ServiceRequests',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Филиалы',
        to: '/ServiceRequests/accordion',
      },
      {
        component: 'CNavItem',
        name: 'Врачи',
        to: '/ServiceRequests/breadcrumbs',
      },
    ],
  },
]

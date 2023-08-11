export default [
  {
    name: 'home', // name is optional, but useful for navigation and linking to this route
    path: '/',
    component: () => import('./pages/HomePage.vue')
  },
  {
    name: 'welcome', // name is optional, but useful for navigation and linking to this route
    path: '/welcome',
    component: () => import('./pages/WelcomePage.vue')
  }
]
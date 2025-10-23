const routes = [
  // 🔹 Quando abrir o app, vai direto pro login
  {
    path: '/',
    redirect: '/login'
  },

  // 🔹 Tela de Login (usando layout próprio)
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },

  // 🔹 Tela principal (IndexPage dentro do MainLayout)
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  // 🔹 Página 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
  
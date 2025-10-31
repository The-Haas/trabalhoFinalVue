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
  },

  {
    path: '/chamados',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ChamadosPage.vue') }
    ]
  },

  {
    path: '/clientes',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ClientesPage.vue') }
    ]
  },

  {
    path: '/cadastro',
    component: () => import('layouts/CadastroLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CadastroPage.vue') }
    ]
  },
  {
    path: '/responsaveis',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ResponsaveisPage.vue') }
    ]
  },
  {
    path: '/status-chamados',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/StatusChamadosPage.vue') }
    ]
  },
  {
    path: '/departamentos',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DepartamentosPage.vue') }
    ]
  },
]

export default routes

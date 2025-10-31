<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">

    <!-- Drawer lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      class="bg-dark text-white"
      :width="230"
    >
      <!-- Logo -->
      <div
        class="q-pa-md flex flex-center column text-white"
        style="background-color: #ff7b00; border-top-right-radius: 12px; border-bottom-left-radius: 12px;"
      >
        <img src="~assets/logo-horus.png" alt="Horus" width="60" height="50" />
      </div>

      <!-- Campo de pesquisa -->
      <q-input
        dense
        filled
        color="orange-7"
        bg-color="white"
        v-model="search"
        placeholder="Pesquisar"
        class="q-ma-sm text-dark"
      >
        <template #prepend>
          <q-icon name="search" color="grey-7" />
        </template>
      </q-input>

      <!-- Menu -->
      <q-list class="menu-list q-mt-sm">
        <q-item
          v-for="link in links"
          :key="link.label"
          clickable
          v-ripple
          :to="link.to"
          active-class="menu-active"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>

      <!-- Logout -->
      <div class="absolute-bottom q-pa-md">
        <q-btn
          icon="logout"
          label="Logout"
          class="full-width"
          flat
          :class="{ 'active-logout': isLogoutActive }"
          @click="handleLogout"
        />
      </div>
    </q-drawer>

    <!-- Cabeçalho -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-weight-bold text-h6"></q-toolbar-title>
        <div class="text-subtitle1 q-mr-md">Bem Vindo Igor</div>
        <q-btn flat round dense icon="settings" />
        <q-btn flat round dense icon="notifications" />
        <q-btn flat round dense icon="account_circle" />
      </q-toolbar>
    </q-header>

    <!-- Conteúdo da página -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const leftDrawerOpen = ref(true)
const search = ref('')
const router = useRouter()

const links = [
  { label: 'Dashboards', icon: 'dashboard', to: '/home' },
  { label: 'Chamados', icon: 'assignment', to: '/chamados'  },
  { label: 'Clientes', icon: 'people', to: '/clientes' },
  { label: 'Responsáveis', icon: 'person', to: '/responsaveis' },
  { label: 'Status Chamados', icon: 'list_alt', to: '/status-chamados' },
  { label: 'Departamentos', icon: 'business', to: '/departamentos'  },
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function handleLogout() {
  console.log('Logout realizado!')
  router.push('/login')
}
</script>

<style scoped>
.q-drawer {
  border-right: 1px solid #1a1a1a;
}

/* ==== Itens do menu ==== */
.menu-item {
  color: white;
  border-radius: 6px;
  margin: 2px 8px;
  transition: background-color 0.2s, transform 0.2s;
}

/* Hover suave */
.menu-item:hover {
  background-color: rgba(255, 123, 0, 0.25);
  transform: translateX(4px);
}

/* Cor de seleção (laranja do logo) */
.menu-active {
  background-color: #ff7b00 !important;
  color: white !important;
}

/* Ícones brancos dentro do item ativo */
.menu-active .q-icon {
  color: white !important;
}

/* Logout */
.q-btn.full-width {
  color: white;
}
.q-btn.full-width:hover {
  background-color: rgba(255, 123, 0, 0.2);
}
</style>

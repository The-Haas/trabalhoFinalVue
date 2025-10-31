<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-4" style="width: 400px; border-radius: 15px;">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Login</div>

        <!-- Campos -->
        <q-input
          filled
          v-model="email"
          label="Email"
          class="q-mb-md"
          type="email"
          autofocus
          @keyup.enter="entrar"
        />

        <q-input
          filled
          v-model="senha"
          label="Senha"
          :type="mostrarSenha ? 'text' : 'password'"
          class="q-mb-sm"
          @keyup.enter="entrar"
        >
          <template #append>
            <q-icon
              :name="mostrarSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

        <div class="text-right q-mb-md">
          <a href="#" class="text-blue text-caption">Esqueceu a Senha?</a>
        </div>

        <!-- Botão -->
        <q-btn
          :loading="carregando"
          :disable="carregando"
          label="Entrar"
          color="orange"
          class="full-width q-mb-md"
          no-caps
          unelevated
          @click="entrar"
        >
          <template #loading>Entrando...</template>
        </q-btn>

        <!-- Link para cadastro -->
        <div class="text-center text-caption q-mb-md">
          Ainda não tem uma conta?
          <router-link to="/cadastro" class="text-blue">Crie uma conta aqui!</router-link>
        </div>

        <div class="text-center text-caption q-mb-sm">
          Siga-nos em nossas redes sociais!
        </div>
        <div class="flex flex-center q-gutter-md">
          <q-btn flat round icon="fab fa-facebook-f" />
          <q-btn flat round icon="fab fa-instagram" />
          <q-btn flat round icon="fab fa-linkedin-in" />
          <q-btn flat round icon="fab fa-youtube" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Mensagem de erro -->
    <q-dialog v-model="erroLogin">
      <q-card class="q-pa-md" style="width: 300px; border-radius: 12px;">
        <q-card-section>
          <div class="text-h6 text-negative">Erro de Login</div>
          <div class="text-body2 q-mt-sm">
            Email ou senha inválidos. <br />
            Use: <b>admin@admin.com</b> / <b>admin</b>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Ok" color="orange" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)
const carregando = ref(false)
const erroLogin = ref(false)

async function entrar() {
  if (carregando.value) return

  const e = email.value.trim().toLowerCase()
  const s = senha.value.trim()

  carregando.value = true
  await new Promise(r => setTimeout(r, 300)) // simula delay

  if (e === 'admin@admin.com' && s === 'admin') {
    router.push('/home')
  } else {
    erroLogin.value = true
  }

  carregando.value = false
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>

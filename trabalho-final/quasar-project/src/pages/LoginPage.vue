<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-4" style="width: 400px; border-radius: 15px;">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Login</div>

        <!-- Campo Email -->
        <q-input
          ref="emailInput"
          filled
          v-model="email"
          label="Email"
          class="q-mb-xs"
          type="email"
          :error="emailTemErro"
          :error-message="emailMsgErro"
          @keyup.enter="entrar"
        />

        <!-- Campo Senha -->
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

        <!-- Botão Entrar -->
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

    <!-- Mensagem email inválido ao tentar logar -->
    <q-dialog v-model="erroEmailPopup">
      <q-card class="q-pa-md" style="width: 300px; border-radius: 12px;">
        <q-card-section>
          <div class="text-h6 text-negative">
            Email inválido
          </div>
          <div class="text-body2 q-mt-sm">
            Por favor, insira um email válido.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="orange" label="Ok" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Popup erro login -->
    <q-dialog v-model="erroLogin">
      <q-card class="q-pa-md" style="width: 300px; border-radius: 12px;">
        <q-card-section>
          <div class="text-h6 text-negative">Erro de Login</div>
          <div class="text-body2 q-mt-sm">
            Email ou senha inválidos.
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from 'src/stores/loginStore'

const router = useRouter()
const loginStore = useLoginStore()

const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)
const carregando = ref(false)
const erroLogin = ref(false)
const erroEmailPopup = ref(false)

const emailTemErro = ref(false)
const emailMsgErro = ref('')

// regex simples e eficiente para validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ref para o q-input do email (usado para dar foco quando tiver erro)
const emailInput = ref(null)

// validação que atualiza flags de erro
function validarEmail() {
  const valor = (email.value || '').trim()

  if (valor === '') {
    // campo vazio => sem erro visual
    emailTemErro.value = false
    emailMsgErro.value = ''
    return false
  }

  if (!emailRegex.test(valor)) {
    emailTemErro.value = true
    emailMsgErro.value = 'Digite um email válido.'
    return false
  }

  emailTemErro.value = false
  emailMsgErro.value = ''
  return true
}

// observa mudanças no email e valida em tempo real
watch(email, () => {
  validarEmail()
})

async function entrar() {
  // valida antes de tentar logar
  const valido = validarEmail()

  if (!valido) {
    // abre popup de email inválido e foca no campo
    erroEmailPopup.value = true
    // foco com timeout curto para garantir que o dialog abriu antes de focar (melhora compatibilidade)
    setTimeout(() => {
      if (emailInput.value && emailInput.value.focus) {
        emailInput.value.focus()
      }
    }, 100)
    return
  }

  // impedir login se campo estiver vazio (por segurança extra)
  if (email.value.trim() === '') {
    erroEmailPopup.value = true
    setTimeout(() => {
      if (emailInput.value && emailInput.value.focus) {
        emailInput.value.focus()
      }
    }, 100)
    return
  }

  carregando.value = true

  const ok = await loginStore.login(
    email.value.trim().toLowerCase(),
    senha.value.trim()
  )

  carregando.value = false

  if (ok) {
    router.push('/home')
  } else {
    erroLogin.value = true
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>

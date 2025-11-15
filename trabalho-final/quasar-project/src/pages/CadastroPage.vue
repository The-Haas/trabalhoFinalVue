<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-4" style="width: 400px; border-radius: 15px;">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Cadastre-se</div>

        <!-- Email -->
        <q-input
          filled
          v-model="email"
          label="Email"
          type="email"
          class="q-mb-sm"
          :error="email !== '' && !emailValido"
          :error-message="email !== '' && !emailValido ? emailErro : ''"
        />

        <!-- Senha -->
        <q-input
          filled
          v-model="senha"
          :type="mostrarSenha ? 'text' : 'password'"
          label="Senha"
          class="q-mb-sm"
          :error="senha !== '' && !senhaValida"
          :error-message="senha !== '' && !senhaValida ? senhaErro : ''"
        >
          <template #append>
            <q-icon
              :name="mostrarSenha ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

        <!-- Confirmar Senha -->
        <q-input
          filled
          v-model="confirmarSenha"
          :type="mostrarConfirmar ? 'text' : 'password'"
          label="Confirmar Senha"
          class="q-mb-md"
          :error="confirmarSenha !== '' && confirmarSenha !== senha"
          :error-message="confirmarSenha !== '' && confirmarSenha !== senha ? 'A confirmação deve ser igual à senha.' : ''"
        >
          <template #append>
            <q-icon
              :name="mostrarConfirmar ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="mostrarConfirmar = !mostrarConfirmar"
            />
          </template>
        </q-input>

        <q-btn
          label="Cadastrar-se"
          color="orange"
          class="full-width"
          @click="cadastrar"
        />

        <div class="text-center q-mt-sm">
          Já tem uma conta?
          <a href="/login">Faça Login aqui!</a>
        </div>

        <div class="text-center q-mt-md">
          Siga-nos em nossas redes sociais!
          <div class="row justify-center q-mt-xs">
            <q-btn round flat icon="fab fa-facebook-f" />
            <q-btn round flat icon="fab fa-instagram" />
            <q-btn round flat icon="fab fa-linkedin-in" />
            <q-btn round flat icon="fab fa-youtube" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRegisterStore } from 'src/stores/registerStore'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

// Inputs
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')

// Toggle de mostrar senha (olhinho)
const mostrarSenha = ref(false)
const mostrarConfirmar = ref(false)

const router = useRouter()
const $q = useQuasar()
const registerStore = useRegisterStore()

// ===== REGEX =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

// ===== Validações =====
const emailValido = computed(() => emailRegex.test(email.value))
const senhaValida = computed(() => senhaRegex.test(senha.value))

const emailErro = 'Informe um email válido.'
const senhaErro =
  'A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial.'

async function cadastrar() {
  if (!email.value || !senha.value || !confirmarSenha.value) {
    return $q.notify({
      type: 'warning',
      message: 'Preencha todos os campos!'
    })
  }

  if (!emailValido.value) {
    return $q.notify({
      type: 'negative',
      message: 'Informe um email válido!'
    })
  }

  if (!senhaValida.value) {
    return $q.notify({
      type: 'negative',
      message: senhaErro
    })
  }

  if (senha.value !== confirmarSenha.value) {
    return $q.notify({
      type: 'negative',
      message: 'As senhas não coincidem!'
    })
  }

  const result = await registerStore.cadastrar(
    email.value.trim().toLowerCase(),
    senha.value.trim()
  )

  if (!result.ok) {
    return $q.notify({
      type: 'negative',
      message: result.msg
    })
  }

  $q.notify({
    type: 'positive',
    message: 'Cadastro realizado com sucesso!',
    caption: 'Você já pode fazer login.',
    icon: 'check_circle',
    timeout: 2500,
    position: 'top'
  })

  router.push('/login')
}
</script>

<style scoped>
a {
  color: #027be3;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>

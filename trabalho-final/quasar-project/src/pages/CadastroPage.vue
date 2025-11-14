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
        />

        <!-- Senha -->
        <q-input
          filled
          v-model="senha"
          label="Senha"
          type="password"
          :toggle-password="true"
          class="q-mb-sm"
        />

        <!-- Confirmar Senha -->
        <q-input
          filled
          v-model="confirmarSenha"
          label="Confirmar Senha"
          type="password"
          :toggle-password="true"
          class="q-mb-md"
        />

        <!-- Botão Cadastrar -->
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
import { ref } from 'vue'
import { useRegisterStore } from 'src/stores/registerStore'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')

const router = useRouter()
const $q = useQuasar()
const registerStore = useRegisterStore()

async function cadastrar() {
  if (!email.value || !senha.value || !confirmarSenha.value) {
    return $q.notify({
      type: 'warning',
      message: 'Preencha todos os campos!'
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

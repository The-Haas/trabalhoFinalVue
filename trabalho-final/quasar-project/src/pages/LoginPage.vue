<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-lg shadow-4" style="width: 400px; border-radius: 15px;">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Login</div>

        <!-- Campos de Email e Senha -->
        <q-input
          filled
          v-model="email"
          label="Email"
          class="q-mb-md"
          type="email"
        />
        <q-input
          filled
          v-model="senha"
          label="Senha"
          :type="mostrarSenha ? 'text' : 'password'"
          class="q-mb-sm"
        >
          <template v-slot:append>
            <q-icon
              :name="mostrarSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </q-input>

        <!-- Link de esqueci a senha -->
        <div class="text-right q-mb-md">
          <a href="#" class="text-blue text-caption">Esqueceu a Senha?</a>
        </div>

        <!-- Botão Entrar -->
        <q-btn
          label="Entrar"
          color="orange"
          class="full-width q-mb-md"
          no-caps
          unelevated
          @click="entrar"
        />

        <!-- Link para criar conta -->
        <div class="text-center text-caption q-mb-md">
          Ainda não tem uma conta?
          <a href="#" class="text-blue">Crie uma conta aqui!</a>
        </div>

        <!-- Redes sociais -->
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
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // 👈 precisa importar isso

const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)

const router = useRouter() // 👈 cria instância do roteador

function entrar() {
  // Aqui você pode colocar validação se quiser
  // Por enquanto apenas redireciona:
  router.push('/home') // 👈 vai para a rota do IndexPage
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>

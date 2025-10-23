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
          <a href="/login">Crie uma conta aqui!</a>
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

<script>
export default {
  name: "CadastroPage",
  data() {
    return {
      email: "",
      senha: "",
      confirmarSenha: "",
    };
  },
  methods: {
    cadastrar() {
      if (this.senha !== this.confirmarSenha) {
        this.$q.notify({
          type: "negative",
          message: "As senhas não coincidem!",
        });
        return;
      }
      // Aqui você pode chamar sua API para registrar o usuário
      console.log("Cadastro realizado com:", this.email, this.senha);
    },
  },
};
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

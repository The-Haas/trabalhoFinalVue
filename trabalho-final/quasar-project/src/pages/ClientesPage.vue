<template>
  <q-page class="q-pa-lg bg-grey-2 q-gutter-y-lg">

    <!-- ===== Título e Botão ===== -->
    <div class="flex items-center justify-between q-mb-md">
      <h5 class="text-h5 text-weight-bold text-dark">Gestão de Clientes</h5>
      <q-btn color="orange" icon="add" label="Novo Cliente" @click="abrirModalNovoCliente" />
    </div>

    <!-- ===== Campo de Pesquisa ===== -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="filtro"
          dense
          filled
          placeholder="Buscar cliente..."
          clearable
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- ===== Tabela ===== -->
    <q-card class="q-pa-none card-rounded">
      <q-table
        title="Lista de Clientes"
        :rows="clientesFiltrados"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        dense
        :pagination="{ rowsPerPage: 8 }"
      >
        <!-- Status -->
        <template #body-cell-ativo="props">
          <q-td :props="props">
            <q-badge :color="props.row.ativo ? 'green' : 'red'" class="text-white">
              {{ props.row.ativo ? 'Ativo' : 'Inativo' }}
            </q-badge>
          </q-td>
        </template>

        <!-- Ações -->
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn flat round icon="visibility" color="blue" size="sm" @click="visualizarCliente(props.row)" />
            <q-btn flat round icon="edit" color="orange" size="sm" @click="editarCliente(props.row)" />
            <q-btn flat round icon="delete" color="red" size="sm" @click="excluirCliente(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ===== Modal Novo/Editar Cliente ===== -->
    <q-dialog v-model="modalCliente">
      <q-card style="min-width: 450px;">
        <q-card-section>
          <div class="text-h6">{{ modoEdicao ? 'Editar Cliente' : 'Novo Cliente' }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="clienteAtual.razaoSocial" label="Razão Social" filled class="q-mb-md" />
          <q-input v-model="clienteAtual.nomeFantasia" label="Nome Fantasia" filled class="q-mb-md" />
          <q-input v-model="clienteAtual.cnpj" label="CNPJ" mask="##.###.###/####-##" filled class="q-mb-md" />

          <!-- Campo de e-mail com validação reativa -->
          <q-input
            v-model="clienteAtual.email"
            label="E-mail"
            type="email"
            filled
            class="q-mb-md"
            :error="isEmailInvalid"
            :error-message="isEmailInvalid ? 'E-mail inválido' : ''"
          />

          <q-input v-model="clienteAtual.telefone" label="Telefone" mask="(##) #####-####" filled class="q-mb-md" />
          <q-toggle v-model="clienteAtual.ativo" label="Ativo" color="green" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup @click="limparModal" />
          <q-btn color="orange" label="Salvar" @click="salvarCliente" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Modal Visualizar Cliente ===== -->
    <q-dialog v-model="modalVisualizar">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Detalhes do Cliente</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-sm"><strong>Razão Social:</strong> {{ clienteSelecionado?.razaoSocial }}</div>
          <div class="q-mb-sm"><strong>Nome Fantasia:</strong> {{ clienteSelecionado?.nomeFantasia }}</div>
          <div class="q-mb-sm"><strong>CNPJ:</strong> {{ clienteSelecionado?.cnpj }}</div>
          <div class="q-mb-sm"><strong>E-mail:</strong> {{ clienteSelecionado?.email }}</div>
          <div class="q-mb-sm"><strong>Telefone:</strong> {{ clienteSelecionado?.telefone }}</div>
          <div class="q-mb-sm"><strong>Status:</strong>
            <q-badge :color="clienteSelecionado?.ativo ? 'green' : 'red'" class="text-white">
              {{ clienteSelecionado?.ativo ? 'Ativo' : 'Inativo' }}
            </q-badge>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useClientesStore } from 'src/stores/clientesStore'

const $q = useQuasar()
const store = useClientesStore()

// Bind direto com store
const filtro = computed({
  get: () => store.filtro,
  set: (v) => (store.filtro = v)
})

const clientesFiltrados = computed(() => store.clientesFiltrados)

// Colunas
const colunas = [
  { name: 'razaoSocial', label: 'Razão Social', field: 'razaoSocial', align: 'left', sortable: true },
  { name: 'nomeFantasia', label: 'Nome Fantasia', field: 'nomeFantasia', align: 'left', sortable: true },
  { name: 'cnpj', label: 'CNPJ', field: 'cnpj', align: 'left', sortable: true },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

// Modais e dados
const modalCliente = ref(false)
const modalVisualizar = ref(false)
const modoEdicao = ref(false)

const clienteAtual = ref({
  id: null,
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  email: '',
  telefone: '',
  ativo: true
})

const clienteSelecionado = ref(null)

// Validação de E-mail (computed reativo)
// regra: campo vazio => válido (não fica vermelho). Só valida quando usuário digitou algo.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isEmailInvalid = computed(() => {
  const e = clienteAtual.value.email
  if (!e || e.trim() === '') return false // vazio => não inválido (não mostrar erro)
  return !emailRegex.test(e)
})

onMounted(() => {
  store.carregarClientes()
})

// Abrir modal novo
function abrirModalNovoCliente() {
  modoEdicao.value = false
  clienteAtual.value = {
    id: null,
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    ativo: true
  }
  modalCliente.value = true
}

// Limpa dados ao cancelar (opcional, evita estado persistente)
function limparModal() {
  // só limpa quando modal fechado
  // não fecha manualmente aqui, o v-close-popup já fecha
  clienteAtual.value = {
    id: null,
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    email: '',
    telefone: '',
    ativo: true
  }
  modoEdicao.value = false
}

// Salvar (criar ou editar)
async function salvarCliente() {
  if (!clienteAtual.value.razaoSocial || !clienteAtual.value.nomeFantasia) {
    $q.notify({ type: 'warning', message: 'Preencha os campos obrigatórios!' })
    return
  }

  if (isEmailInvalid.value) {
    $q.notify({ type: 'warning', message: 'Informe um e-mail válido!' })
    return
  }

  try {
    if (modoEdicao.value) {
      await store.atualizarCliente(clienteAtual.value)
      $q.notify({ type: 'positive', message: 'Cliente atualizado com sucesso!' })
    } else {
      await store.criarCliente(clienteAtual.value)
      $q.notify({ type: 'positive', message: 'Cliente criado com sucesso!' })
    }
    modalCliente.value = false
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    $q.notify({ type: 'negative', message: 'Erro ao salvar cliente!' })
  }
}

// Visualizar
function visualizarCliente(c) {
  clienteSelecionado.value = c
  modalVisualizar.value = true
}

// Editar
function editarCliente(c) {
  modoEdicao.value = true
  clienteAtual.value = { ...c } // copia para evitar duas-way binding com a fonte original
  // não precisamos chamar validar; computed reavalia automaticamente
  modalCliente.value = true
}

// Excluir
async function excluirCliente(id) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este cliente?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await store.excluirCliente(id)
      $q.notify({ type: 'positive', message: 'Cliente excluído com sucesso!' })
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      $q.notify({ type: 'negative', message: 'Erro ao excluir cliente.' })
    }
  })
}
</script>

<style scoped>
.card-rounded {
  border-radius: 14px;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.08);
}

.q-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.q-table tr:hover td {
  background-color: #fafafa;
}
</style>

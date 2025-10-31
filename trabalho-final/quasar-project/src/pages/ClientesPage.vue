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
        <!-- Coluna ativo -->
        <template #body-cell-ativo="props">
          <q-td :props="props">
            <q-badge :color="props.row.ativo ? 'green' : 'red'" class="text-white">
              {{ props.row.ativo ? 'Ativo' : 'Inativo' }}
            </q-badge>
          </q-td>
        </template>

        <!-- Coluna de ações -->
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
          <q-input v-model="clienteAtual.email" label="E-mail" type="email" filled class="q-mb-md" />
          <q-input v-model="clienteAtual.telefone" label="Telefone" mask="(##) #####-####" filled class="q-mb-md" />
          <q-toggle v-model="clienteAtual.ativo" label="Ativo" color="green" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
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
import { ref, computed } from 'vue'

// ===== Dados e estados =====
const filtro = ref('')
const modalCliente = ref(false)
const modalVisualizar = ref(false)
const modoEdicao = ref(false)

const clientes = ref([
  { id: 1, razaoSocial: 'Horus Faculdades e Sistemas', nomeFantasia: 'Instituição de Ensino Superior', cnpj: '99.999.999/0009-99', email: 'contato@horus.com', telefone: '(49) 99999-9999', ativo: true },
  { id: 2, razaoSocial: 'BM Estética Automotiva', nomeFantasia: 'BM Car', cnpj: '11.222.333/0001-44', email: 'contato@bmcar.com', telefone: '(49) 98888-8888', ativo: false },
  { id: 3, razaoSocial: 'Mariano Sistemas', nomeFantasia: 'Mariano', cnpj: '55.444.333/0001-77', email: 'suporte@Mariano.com', telefone: '(49) 97777-7777', ativo: true }
])

// ===== Colunas =====
const colunas = [
  { name: 'id', label: 'Código', field: 'id', align: 'left', sortable: true },
  { name: 'razaoSocial', label: 'Razão Social', field: 'razaoSocial', align: 'left', sortable: true },
  { name: 'nomeFantasia', label: 'Nome Fantasia', field: 'nomeFantasia', align: 'left', sortable: true },
  { name: 'cnpj', label: 'CNPJ', field: 'cnpj', align: 'center', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

// ===== Filtro dinâmico =====
const clientesFiltrados = computed(() =>
  clientes.value.filter(c =>
    c.razaoSocial.toLowerCase().includes(filtro.value.toLowerCase()) ||
    c.nomeFantasia.toLowerCase().includes(filtro.value.toLowerCase()) ||
    c.cnpj.includes(filtro.value)
  )
)

// ===== Cliente atual =====
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

// ===== Funções principais =====
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

function salvarCliente() {
  if (!clienteAtual.value.razaoSocial || !clienteAtual.value.nomeFantasia) {
    alert('Preencha os campos obrigatórios!')
    return
  }

  if (modoEdicao.value) {
    const index = clientes.value.findIndex(c => c.id === clienteAtual.value.id)
    if (index !== -1) clientes.value[index] = { ...clienteAtual.value }
  } else {
    clienteAtual.value.id = clientes.value.length + 1
    clientes.value.push({ ...clienteAtual.value })
  }

  modalCliente.value = false
}

function visualizarCliente(cliente) {
  clienteSelecionado.value = cliente
  modalVisualizar.value = true
}

function editarCliente(cliente) {
  modoEdicao.value = true
  clienteAtual.value = { ...cliente }
  modalCliente.value = true
}

function excluirCliente(id) {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    clientes.value = clientes.value.filter(c => c.id !== id)
  }
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

<template>
  <q-page class="q-pa-lg bg-grey-2 q-gutter-y-lg">

    <!-- ===== Título e Botão ===== -->
    <div class="flex items-center justify-between q-mb-md">
      <h5 class="text-h5 text-weight-bold text-dark">Gestão de Responsáveis</h5>
      <q-btn color="orange" icon="add" label="Novo Responsável" @click="abrirModalNovo" />
    </div>

    <!-- ===== Campo de Pesquisa ===== -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="filtro"
          dense
          filled
          placeholder="Buscar responsável..."
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
        title="Lista de Responsáveis"
        :rows="responsaveisFiltrados"
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

        <!-- Coluna ações -->
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn flat round icon="visibility" color="blue" size="sm" @click="visualizarResponsavel(props.row)" />
            <q-btn flat round icon="edit" color="orange" size="sm" @click="editarResponsavel(props.row)" />
            <q-btn flat round icon="delete" color="red" size="sm" @click="excluirResponsavel(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ===== Modal Novo/Editar ===== -->
    <q-dialog v-model="modalResponsavel">
      <q-card style="min-width: 450px;">
        <q-card-section>
          <div class="text-h6">{{ modoEdicao ? 'Editar Responsável' : 'Novo Responsável' }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="responsavelAtual.nome" label="Nome do Responsável" filled class="q-mb-md" />
          <q-input v-model="responsavelAtual.email" label="E-mail" type="email" filled class="q-mb-md" />
          <q-input v-model="responsavelAtual.telefone" label="Telefone" mask="(##) #####-####" filled class="q-mb-md" />
          <q-toggle v-model="responsavelAtual.ativo" label="Ativo" color="green" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn color="orange" label="Salvar" @click="salvarResponsavel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Modal Visualizar ===== -->
    <q-dialog v-model="modalVisualizar">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Detalhes do Responsável</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-sm"><strong>Nome:</strong> {{ responsavelSelecionado?.nome }}</div>
          <div class="q-mb-sm"><strong>E-mail:</strong> {{ responsavelSelecionado?.email }}</div>
          <div class="q-mb-sm"><strong>Telefone:</strong> {{ responsavelSelecionado?.telefone }}</div>
          <div class="q-mb-sm"><strong>Status:</strong>
            <q-badge :color="responsavelSelecionado?.ativo ? 'green' : 'red'" class="text-white">
              {{ responsavelSelecionado?.ativo ? 'Ativo' : 'Inativo' }}
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

// ===== Estados =====
const filtro = ref('')
const modalResponsavel = ref(false)
const modalVisualizar = ref(false)
const modoEdicao = ref(false)

// ===== Dados iniciais =====
const responsaveis = ref([
  { id: 1, nome: 'Bruno Bareta', email: 'bruno@horus.com', telefone: '(49) 98888-8888', ativo: true },
  { id: 2, nome: 'Felipe Damo', email: 'felipe@horus.com', telefone: '(49) 97777-7777', ativo: false },
  { id: 3, nome: 'Bruno Balen', email: 'bruno.balen@horus.com', telefone: '(49) 96666-6666', ativo: true },
  { id: 4, nome: 'Mariano', email: 'mariano@horus.com', telefone: '(49) 95555-5555', ativo: true },
  { id: 5, nome: 'Joves', email: 'joves@horus.com', telefone: '(49) 94444-4444', ativo: true }
])

// ===== Colunas =====
const colunas = [
  { name: 'id', label: 'Código', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Responsável', field: 'nome', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

// ===== Filtro dinâmico =====
const responsaveisFiltrados = computed(() =>
  responsaveis.value.filter(r =>
    r.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

// ===== Responsável atual =====
const responsavelAtual = ref({
  id: null,
  nome: '',
  email: '',
  telefone: '',
  ativo: true
})

const responsavelSelecionado = ref(null)

// ===== Funções =====
function abrirModalNovo() {
  modoEdicao.value = false
  responsavelAtual.value = { id: null, nome: '', email: '', telefone: '', ativo: true }
  modalResponsavel.value = true
}

function salvarResponsavel() {
  if (!responsavelAtual.value.nome) {
    alert('O nome do responsável é obrigatório!')
    return
  }

  if (modoEdicao.value) {
    const index = responsaveis.value.findIndex(r => r.id === responsavelAtual.value.id)
    if (index !== -1) responsaveis.value[index] = { ...responsavelAtual.value }
  } else {
    responsavelAtual.value.id = responsaveis.value.length + 1
    responsaveis.value.push({ ...responsavelAtual.value })
  }

  modalResponsavel.value = false
}

function visualizarResponsavel(responsavel) {
  responsavelSelecionado.value = responsavel
  modalVisualizar.value = true
}

function editarResponsavel(responsavel) {
  modoEdicao.value = true
  responsavelAtual.value = { ...responsavel }
  modalResponsavel.value = true
}

function excluirResponsavel(id) {
  if (confirm('Tem certeza que deseja excluir este responsável?')) {
    responsaveis.value = responsaveis.value.filter(r => r.id !== id)
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

<template>
  <q-page class="q-pa-lg bg-grey-2 q-gutter-y-lg">

    <!-- ===== Título e Botão ===== -->
    <div class="flex items-center justify-between q-mb-md">
      <h5 class="text-h5 text-weight-bold text-dark">Gestão de Departamentos</h5>
      <q-btn color="orange" icon="add" label="Novo Departamento" @click="abrirModalNovo" />
    </div>

    <!-- ===== Campo de Pesquisa ===== -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="filtro"
          dense
          filled
          placeholder="Buscar departamento..."
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
        title="Lista de Departamentos"
        :rows="departamentosFiltrados"
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
            <q-btn flat round icon="visibility" color="blue" size="sm" @click="visualizarDepartamento(props.row)" />
            <q-btn flat round icon="edit" color="orange" size="sm" @click="editarDepartamento(props.row)" />
            <q-btn flat round icon="delete" color="red" size="sm" @click="excluirDepartamento(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ===== Modal Novo/Editar ===== -->
    <q-dialog v-model="modalDepartamento">
      <q-card style="min-width: 450px;">
        <q-card-section>
          <div class="text-h6">{{ modoEdicao ? 'Editar Departamento' : 'Novo Departamento' }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="departamentoAtual.nome" label="Nome do Departamento" filled class="q-mb-md" />
          <q-toggle v-model="departamentoAtual.ativo" label="Ativo" color="green" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn color="orange" label="Salvar" @click="salvarDepartamento" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Modal Visualizar ===== -->
    <q-dialog v-model="modalVisualizar">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Detalhes do Departamento</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-sm"><strong>Nome:</strong> {{ departamentoSelecionado?.nome }}</div>
          <div class="q-mb-sm">
            <strong>Status:</strong>
            <q-badge :color="departamentoSelecionado?.ativo ? 'green' : 'red'" class="text-white q-ml-sm">
              {{ departamentoSelecionado?.ativo ? 'Ativo' : 'Inativo' }}
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
import { ref, computed, onMounted } from 'vue'
import { useDepartamentosStore } from 'src/stores/departamentosStore'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const store = useDepartamentosStore()

// ===== Estados =====
const filtro = ref('')
const modalDepartamento = ref(false)
const modalVisualizar = ref(false)
const modoEdicao = ref(false)

const departamentoAtual = ref({
  id: null,
  nome: '',
  ativo: true
})

const departamentoSelecionado = ref(null)

// ===== Colunas da tabela =====
const colunas = [
  { name: 'id', label: 'Código', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'ativo', label: 'Status', field: 'ativo', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

// ===== Computed para filtro =====
const departamentosFiltrados = computed(() =>
  store.departamentos.filter(d =>
    d.nome.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

// ===== Carregar departamentos ao montar =====
onMounted(() => {
  store.listar()
})

// ===== Funções =====
function abrirModalNovo() {
  modoEdicao.value = false
  departamentoAtual.value = { id: null, nome: '', ativo: true }
  modalDepartamento.value = true
}

async function salvarDepartamento() {
  if (!departamentoAtual.value.nome.trim()) {
    $q.notify({ type: 'negative', message: 'O nome do departamento é obrigatório!' })
    return
  }

  if (modoEdicao.value) {
    await store.atualizar(departamentoAtual.value.id, departamentoAtual.value)
    $q.notify({ type: 'positive', message: 'Departamento atualizado!' })
  } else {
    await store.criar(departamentoAtual.value)
    $q.notify({ type: 'positive', message: 'Departamento criado!' })
  }

  modalDepartamento.value = false
}

function visualizarDepartamento(departamento) {
  departamentoSelecionado.value = departamento
  modalVisualizar.value = true
}

function editarDepartamento(departamento) {
  modoEdicao.value = true
  departamentoAtual.value = { ...departamento }
  modalDepartamento.value = true
}

async function excluirDepartamento(id) {
  $q.dialog({
    title: 'Confirmar',
    message: 'Deseja realmente excluir este departamento?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await store.remover(id)
    $q.notify({ type: 'positive', message: 'Departamento removido!' })
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

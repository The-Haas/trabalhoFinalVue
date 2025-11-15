<template>
  <q-page class="q-pa-lg bg-grey-2 q-gutter-y-lg">

    <!-- ===== Título e Botão ===== -->
    <div class="flex items-center justify-between q-mb-md">
      <h5 class="text-h5 text-weight-bold text-dark">Gestão de Chamados</h5>
      <q-btn color="orange" icon="add" label="Novo Chamado" @click="abrirModalNovoChamado" />
    </div>

    <!-- ===== Campo de Pesquisa ===== -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-4">
        <q-input v-model="filtro" dense filled placeholder="Buscar chamado..." clearable>
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- ===== Tabela ===== -->
    <q-card class="q-pa-none card-rounded">
      <q-table title="Lista de Chamados" :rows="chamadosFiltrados" :columns="colunas" row-key="id" flat bordered dense
        :pagination="{ rowsPerPage: 8 }">
        <!-- Coluna de status -->
        <template #body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getCorStatus(props.row.status)" class="text-white">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>

        <!-- Coluna de ações -->
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn flat round icon="visibility" color="blue" size="sm" @click="visualizarChamado(props.row)" />
            <q-btn flat round icon="edit" color="orange" size="sm" @click="editarChamado(props.row)" />
            <q-btn flat round icon="delete" color="red" size="sm" @click="excluirChamado(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ===== Modal Novo/Editar Chamado ===== -->
    <q-dialog v-model="modalChamado">
      <q-card style="min-width: 450px;">
        <q-card-section>
          <div class="text-h6">{{ modoEdicao ? 'Editar Chamado' : 'Novo Chamado' }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-input v-model="chamadoAtual.cliente" label="Cliente" filled class="q-mb-md" />
          <q-input v-model="chamadoAtual.titulo" label="Título" filled class="q-mb-md" />
          <q-input v-model="chamadoAtual.dataAbertura" label="Data de Abertura" type="date" filled class="q-mb-md" />
          <q-select v-model="chamadoAtual.departamento" label="Departamento" filled
            :options="['Suporte', 'Financeiro', 'Desenvolvimento']" class="q-mb-md" />
          <q-select v-model="chamadoAtual.status" label="Status" filled
            :options="['Aberto', 'Em Andamento', 'Fechado']" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn color="orange" label="Salvar" @click="salvarChamado" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Modal Visualizar Chamado ===== -->
    <q-dialog v-model="modalVisualizar">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Detalhes do Chamado</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-sm"><strong>Cliente:</strong> {{ chamadoSelecionado?.cliente }}</div>
          <div class="q-mb-sm"><strong>Título:</strong> {{ chamadoSelecionado?.titulo }}</div>
          <div class="q-mb-sm"><strong>Data de Abertura:</strong> {{ chamadoSelecionado?.dataAbertura }}</div>
          <div class="q-mb-sm"><strong>Departamento:</strong> {{ chamadoSelecionado?.departamento }}</div>
          <div class="q-mb-sm"><strong>Status:</strong>
            <q-badge :color="getCorStatus(chamadoSelecionado?.status)" class="text-white">
              {{ chamadoSelecionado?.status }}
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
import { useQuasar } from 'quasar'
import { useChamadosStore } from 'src/stores/chamadosStore'

// ===== Quasar e Store =====
const $q = useQuasar()
const store = useChamadosStore()

// ===== Estados dos modais =====
const filtro = ref('')
const modalChamado = ref(false)
const modalVisualizar = ref(false)
const modoEdicao = ref(false)

// ===== Carregar chamados ao abrir a página =====
onMounted(() => {
  store.carregarChamados()
})

// ===== Chamados do backend =====
const chamados = computed(() => store.lista)

// ===== Colunas =====
const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'cliente', label: 'Cliente', field: 'cliente', align: 'left', sortable: true },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true },
  { name: 'dataAbertura', label: 'Data de Abertura', field: 'dataAbertura', align: 'center', sortable: true },
  { name: 'departamento', label: 'Departamento', field: 'departamento', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

// ===== Filtro dinâmico =====
const chamadosFiltrados = computed(() =>
  chamados.value.filter(c =>
    c.titulo.toLowerCase().includes(filtro.value.toLowerCase()) ||
    c.cliente.toLowerCase().includes(filtro.value.toLowerCase())
  )
)

// ===== Chamado atual =====
const chamadoAtual = ref({
  id: null,
  cliente: '',
  titulo: '',
  dataAbertura: '',
  departamento: '',
  status: 'Aberto'
})

const chamadoSelecionado = ref(null)

// ===== Funções =====

// Novo chamado
function abrirModalNovoChamado() {
  modoEdicao.value = false
  chamadoAtual.value = {
    id: null,
    cliente: '',
    titulo: '',
    dataAbertura: new Date().toISOString().substring(0, 10),
    departamento: '',
    status: 'Aberto'
  }
  modalChamado.value = true
}

// Criar ou editar chamado (JSON Server)
async function salvarChamado() {
  if (!chamadoAtual.value.cliente || !chamadoAtual.value.titulo) {
    return $q.notify({
      type: 'warning',
      message: 'Preencha todos os campos obrigatórios!'
    })
  }

    if (modoEdicao.value) {
      await store.editarChamado({ ...chamadoAtual.value })
      $q.notify({ type: 'positive', message: 'Chamado atualizado!' })
    } else {
      await store.criarChamado({ ...chamadoAtual.value })
      $q.notify({ type: 'positive', message: 'Chamado criado com sucesso!' })
    }

    modalChamado.value = false

}

// Visualizar chamado
function visualizarChamado(chamado) {
  chamadoSelecionado.value = chamado
  modalVisualizar.value = true
}

// Editar chamado
function editarChamado(chamado) {
  modoEdicao.value = true
  chamadoAtual.value = { ...chamado }
  modalChamado.value = true
}

// Excluir chamado — versão robusta com logs e tratamento
async function excluirChamado(id) {
  console.log('[UI] excluirChamado chamado com id:', id, 'tipo:', typeof id)

  // cheque rápido no array local antes de abrir o dialog
  const existeLocal = store.lista.some(c => Number(c.id) === Number(id))
  console.log('[UI] existeLocal?', existeLocal)

  $q.dialog({
    title: 'Excluir Chamado',
    message: 'Tem certeza que deseja excluir este chamado?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      // força número
      const numericId = Number(id)
      console.log('[UI] chamando store.excluirChamado com id (number):', numericId)

      await store.excluirChamado(numericId)

      // recarrega a lista do backend pra garantir sincronia
      await store.carregarChamados()

      $q.notify({ type: 'positive', message: 'Chamado excluído!' })
    } catch (err) {
      console.error('[UI] erro ao excluir chamado:', err)
      $q.notify({ type: 'negative', message: 'Erro ao excluir chamado: ' + (err?.message || '') })
    }
  })
}


// ===== Cor por status =====
function getCorStatus(status) {
  switch (status) {
    case 'Aberto': return 'orange'
    case 'Em Andamento': return 'amber'
    case 'Fechado': return 'green'
    default: return 'grey'
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

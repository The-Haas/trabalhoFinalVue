<template>
  <q-page class="q-pa-lg bg-grey-2 q-gutter-y-lg">

    <!-- ===== Título e Botão ===== -->
    <div class="flex items-center justify-between q-mb-md">
      <h5 class="text-h5 text-weight-bold text-dark">Gestão de Status de Chamados</h5>
      <q-btn color="orange" icon="add" label="Novo Status" @click="abrirModalNovo" />
    </div>

    <!-- ===== Campo de Pesquisa ===== -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="filtro"
          dense
          filled
          placeholder="Buscar status..."
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
        title="Lista de Status"
        :rows="statusFiltrados"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        dense
        :pagination="{ rowsPerPage: 8 }"
      >
        <!-- Coluna cor -->
        <template #body-cell-cor="props">
          <q-td :props="props">
            <div class="flex items-center">
              <div
                :style="{ backgroundColor: props.row.cor, width: '20px', height: '20px', borderRadius: '4px' }"
                class="q-mr-sm"
              ></div>
              <span>{{ props.row.cor }}</span>
            </div>
          </q-td>
        </template>

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
            <q-btn flat round icon="visibility" color="blue" size="sm" @click="visualizarStatus(props.row)" />
            <q-btn flat round icon="edit" color="orange" size="sm" @click="editarStatus(props.row)" />
            <q-btn flat round icon="delete" color="red" size="sm" @click="excluirStatus(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- ===== Modal Novo/Editar ===== -->
    <q-dialog v-model="modalStatus">
      <q-card style="min-width: 460px;">
        <q-card-section>
          <div class="text-h6">{{ modoEdicao ? 'Editar Status' : 'Novo Status' }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- CORRIGIDO: v-model para descricao -->
          <q-input v-model="statusAtual.descricao" label="Nome do Status" filled class="q-mb-md" />

          <!-- Campo de cor com seletor -->
          <q-field label="Cor" filled stack-label class="q-mb-md">
            <template #control>
              <div class="row items-center q-gutter-sm">
                <div
                  :style="{
                    backgroundColor: statusAtual.cor,
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    cursor: 'pointer'
                  }"
                  @click.stop="abrirSeletorCor = true"
                ></div>
                <span>{{ statusAtual.cor }}</span>

                <!-- Popup com seletor de cor -->
                <q-popup-proxy v-model="abrirSeletorCor" cover transition-show="scale" transition-hide="scale">
                  <q-color
                    v-model="statusAtual.cor"
                    format-model="hex"
                    default-view="palette"
                    bordered
                    no-header
                  />
                </q-popup-proxy>
              </div>
            </template>
          </q-field>

          <q-toggle v-model="statusAtual.ativo" label="Ativo" color="green" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn color="orange" label="Salvar" @click="salvarStatus" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ===== Modal Visualizar ===== -->
    <q-dialog v-model="modalVisualizar">
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Detalhes do Status</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-sm"><strong>Nome:</strong> {{ statusSelecionado?.descricao }}</div>
          <div class="q-mb-sm flex items-center">
            <strong>Cor:</strong>
            <div
              :style="{ backgroundColor: statusSelecionado?.cor, width: '20px', height: '20px', borderRadius: '4px', marginLeft: '8px' }"
            ></div>
            <span class="q-ml-sm">{{ statusSelecionado?.cor }}</span>
          </div>
          <div class="q-mb-sm">
            <strong>Status:</strong>
            <q-badge :color="statusSelecionado?.ativo ? 'green' : 'red'" class="text-white q-ml-sm">
              {{ statusSelecionado?.ativo ? 'Ativo' : 'Inativo' }}
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
import { ref, computed, onMounted } from "vue";
import { useStatusStore } from "src/stores/statusStore";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = useStatusStore();

// ===== Estados =====
const filtro = ref("");
const modalStatus = ref(false);
const modalVisualizar = ref(false);
const modoEdicao = ref(false);
const abrirSeletorCor = ref(false);

const statusAtual = ref({
  id: null,
  descricao: "",
  cor: "#000000",
  ativo: true
});

const statusSelecionado = ref(null);

// ===== Tabela (colunas com ícones) =====
const colunas = [
  { name: "id", label: "Código", field: "id", align: "left", sortable: true },
  { name: "descricao", label: "Status", field: "descricao", align: "left", sortable: true },
  { name: "cor", label: "Cor", field: "cor", align: "center" },
  { name: "ativo", label: "Ativo", field: "ativo", align: "center" },
  { name: "acoes", label: "Ações", field: "acoes", align: "center" }
];

// ===== Carregamento inicial =====
onMounted(() => {
  store.listar();
});

// ===== Filtro da tabela =====
const statusFiltrados = computed(() =>
  store.status.filter(s =>
    s.descricao.toLowerCase().includes(filtro.value.toLowerCase())
  )
);

// ===== Funções =====
function abrirModalNovo() {
  modoEdicao.value = false;
  statusAtual.value = { id: null, descricao: "", cor: "#000000", ativo: true };
  modalStatus.value = true;
}

async function salvarStatus() {
  if (!statusAtual.value.descricao.trim()) {
    $q.notify({ type: "negative", message: "O nome do status é obrigatório!" });
    return;
  }

  if (modoEdicao.value) {
    await store.atualizar(statusAtual.value.id, statusAtual.value);
    $q.notify({ type: "positive", message: "Status atualizado!" });
  } else {
    await store.criar(statusAtual.value);
    $q.notify({ type: "positive", message: "Status criado!" });
  }

  modalStatus.value = false;
}

function visualizarStatus(status) {
  statusSelecionado.value = status;
  modalVisualizar.value = true;
}

function editarStatus(status) {
  modoEdicao.value = true;
  statusAtual.value = { ...status };
  modalStatus.value = true;
}

async function excluirStatus(id) {
  $q.dialog({
    title: "Confirmar",
    message: "Deseja realmente excluir este status?",
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await store.remover(id);
    $q.notify({ type: "positive", message: "Status removido!" });
  });
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

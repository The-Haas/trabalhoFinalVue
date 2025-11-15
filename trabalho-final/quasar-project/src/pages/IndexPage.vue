<template>
  <q-page class="q-pa-lg bg-grey-2 q-gutter-y-lg">

    <!-- ===== Título e Filtro de Datas ===== -->
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="col">
        <h5 class="text-h5 text-weight-bold">Painel de Controle</h5>
      </div>

      <!-- Campos de Data -->
      <div class="col-auto">
        <q-input
          filled
          v-model="dataInicial"
          type="date"
          label="Data Inicial"
          dense
          class="q-mr-sm"
        />
      </div>
      <div class="col-auto">
        <q-input
          filled
          v-model="dataFinal"
          type="date"
          label="Data Final"
          dense
          class="q-mr-sm"
        />
      </div>

      <!-- Botão OK -->
      <div class="col-auto">
        <q-btn color="orange" label="OK" @click="atualizarDashboard" />
      </div>
    </div>

    <!-- ===== Cards principais ===== -->
    <div class="row q-col-gutter-lg q-mb-lg q-pa-md">

      <div class="col-12 col-sm-4">
        <q-card class="card-metric q-pa-md">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Chamados Abertos</div>
            <div class="text-h5 text-weight-bold text-orange">{{ qtdChamados('Aberto') }}</div>
            <div class="text-caption text-grey">No período</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="card-metric q-pa-md">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Chamados Fechados</div>
            <div class="text-h5 text-weight-bold text-green">{{ qtdChamados('Fechado') }}</div>
            <div class="text-caption text-grey">No período</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="card-metric q-pa-md">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Total de Chamados</div>
            <div class="text-h5 text-weight-bold text-blue">{{ chamados.length }}</div>
            <div class="text-caption text-grey">No período</div>
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- ===== Indicadores ===== -->
    <div class="row q-col-gutter-lg q-mb-lg q-pa-md indicadores">

      <div class="col-12 col-md-7">
        <q-card class="q-pa-lg card-rounded">
          <div class="text-subtitle1 text-weight-bold q-mb-md flex items-center">
            <q-icon name="timeline" class="q-mr-sm text-orange" size="20px" />
            Resumo de Chamados
          </div>

          <div v-for="(item, i) in chamadosStatus" :key="i" class="q-mb-md">
            <div class="row justify-between">
              <div>{{ item.nome }}</div>
              <div>{{ item.qtd }}</div>
            </div>
            <q-linear-progress
              :value="item.qtd / totalChamados"
              :color="item.cor"
              track-color="grey-3"
              rounded
              size="16px"
            />
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card class="q-pa-lg flex flex-center column card-rounded">
          <div class="text-subtitle1 text-weight-bold q-mb-md flex items-center">
            <q-icon name="pie_chart" class="q-mr-sm text-orange" size="20px" />
            Percentual de Chamados
          </div>

          <q-circular-progress
            show-value
            :value="percentualFechados"
            size="140px"
            color="orange"
            class="q-mb-md"
          >
            {{ percentualFechados }}%
          </q-circular-progress>
          <div class="text-grey-7 text-caption">Concluídos no período</div>
        </q-card>
      </div>

    </div>

    <!-- ===== Linha inferior ===== -->
    <div class="row q-col-gutter-lg q-pa-md linha-inferior">

      <div class="col-12 col-md-6">
        <q-card class="q-pa-lg card-rounded">
          <div class="text-subtitle1 text-weight-bold q-mb-md flex items-center">
            <q-icon name="star" class="q-mr-sm text-orange" size="20px" />
            Ranking Clientes
          </div>

          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th>Cliente</th>
                <th class="text-right">Chamados</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(resp, i) in ranking" :key="i">
                <td>{{ i + 1 }}º - {{ resp.nome }}</td>
                <td class="text-right">{{ resp.chamados }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="q-pa-lg card-rounded">
          <div class="text-subtitle1 text-weight-bold q-mb-md flex items-center">
            <q-icon name="bar_chart" class="q-mr-sm text-orange" size="20px" />
            Chamados por Departamento
          </div>

          <div v-for="(dep, i) in departamentos" :key="i" class="q-mb-md">
            <div class="row justify-between">
              <div>{{ dep.nome }}</div>
              <div>{{ dep.qtd }}</div>
            </div>
            <q-linear-progress
              :value="dep.qtd / totalChamados"
              :color="dep.cor"
              track-color="grey-3"
              rounded
              size="16px"
            />
          </div>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useIndexStore } from '../stores/indexStore'

const indexStore = useIndexStore()

// Campos de data
const dataInicial = ref('')
const dataFinal = ref('')

// Quando carregar a página, pré-seleciona o mês atual
onMounted(async () => {
  const hoje = new Date()
  const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const formatarData = (date) => date.toISOString().split('T')[0]

  dataInicial.value = formatarData(primeiroDia)
  dataFinal.value = formatarData(hoje)

  await indexStore.buscarChamados(dataInicial.value, dataFinal.value)
})

// Atualiza os widgets ao clicar em OK
const atualizarDashboard = async () => {
  await indexStore.buscarChamados(dataInicial.value, dataFinal.value)
}

// Computeds para facilitar
const chamados = computed(() => indexStore.chamados)
const chamadosStatus = computed(() => indexStore.chamadosStatus)
const ranking = computed(() => indexStore.ranking)
const departamentos = computed(() => indexStore.departamentos)
const totalChamados = computed(() => chamados.value.length)
const percentualFechados = computed(() => {
  if (!totalChamados.value) return 0
  const fechados = chamadosStatus.value.find(s => s.nome === 'Fechado')
  return fechados ? Math.round((fechados.qtd / totalChamados.value) * 100) : 0
})

// Função auxiliar
const qtdChamados = (status) => {
  const s = chamadosStatus.value.find(s => s.nome === status)
  return s ? s.qtd : 0
}
</script>

<style scoped>
/* ==== Cards superiores ==== */
.card-metric {
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.card-metric:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

/* ==== Cards inferiores (extra arredondamento) ==== */
.card-rounded {
  border-radius: 14px !important;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-rounded:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* ==== Espaçamento geral ==== */
.q-page {
  min-height: 100vh;
}

/* ==== Estilo da tabela ==== */
.q-markup-table th {
  background-color: #f7f7f7;
  color: #333;
  font-weight: 600;
}

.q-markup-table td {
  padding: 8px 12px;
}

.q-markup-table tr:hover td {
  background-color: #fafafa;
}
</style>

<template>
  <q-page class="q-pa-lg bg-grey-2 q-gutter-y-lg">

    <!-- ===== Título ===== -->
    <div>
      <h5 class="text-h5 text-weight-bold">Painel de Controle</h5>
    </div>

    <!-- ===== Cards principais ===== -->
    <div class="row q-col-gutter-lg q-mb-lg q-pa-md">

      <div class="col-12 col-sm-4">
        <q-card class="card-metric q-pa-md">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Chamados Abertos</div>
            <div class="text-h5 text-weight-bold text-orange">50</div>
            <div class="text-caption text-grey">Nesta Semana</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="card-metric q-pa-md">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Chamados Fechados</div>
            <div class="text-h5 text-weight-bold text-green">100</div>
            <div class="text-caption text-grey">Nesta Semana</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card class="card-metric q-pa-md">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">Total de Chamados</div>
            <div class="text-h5 text-weight-bold text-blue">150</div>
            <div class="text-caption text-grey">Nesta Semana</div>
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
              :value="item.qtd / 100"
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
            :value="50"
            size="140px"
            color="orange"
            class="q-mb-md"
          >
            50%
          </q-circular-progress>
          <div class="text-grey-7 text-caption">Concluídos nesta semana</div>
        </q-card>
      </div>

    </div>

    <!-- ===== Linha inferior ===== -->
    <div class="row q-col-gutter-lg q-pa-md linha-inferior">

      <div class="col-12 col-md-6">
        <q-card class="q-pa-lg card-rounded">
          <div class="text-subtitle1 text-weight-bold q-mb-md flex items-center">
            <q-icon name="star" class="q-mr-sm text-orange" size="20px" />
            Ranking Responsáveis
          </div>

          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th>Responsável</th>
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
              :value="dep.qtd / 100"
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
import { ref } from 'vue'

const chamadosStatus = ref([
  { nome: 'Abertos', qtd: 50, cor: 'orange' },
  { nome: 'Em Andamento', qtd: 50, cor: 'amber' },
  { nome: 'Fechados', qtd: 100, cor: 'green' }
])

const ranking = ref([
  { nome: 'Felipe Damo', chamados: 30 },
  { nome: 'Bruno Bareta', chamados: 29 },
  { nome: 'Bruno Balen', chamados: 28 },
  { nome: 'Budacir', chamados: 25 },
  { nome: 'Jorge Trento', chamados: 23 },
  { nome: 'Jov', chamados: 20 },
  { nome: 'Mariano', chamados: 18 },
  { nome: 'Rambo', chamados: 15 }
])

const departamentos = ref([
  { nome: 'Financeiro', qtd: 50, cor: 'blue' },
  { nome: 'Suporte', qtd: 100, cor: 'orange' },
  { nome: 'Desenvolvimento', qtd: 30, cor: 'green' }
])
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

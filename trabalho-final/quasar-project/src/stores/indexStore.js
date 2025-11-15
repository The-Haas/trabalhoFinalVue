// src/stores/indexStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useIndexStore = defineStore('indexStore', {
  state: () => ({
    chamados: [],
    ranking: [],
    chamadosStatus: [],
    departamentos: [],
    loading: false
  }),
  actions: {
    async buscarChamados(dataInicial, dataFinal) {
      try {
        this.loading = true

        // Consulta ao JSON Server
        const response = await axios.get('http://localhost:3000/chamados')
        let chamados = response.data

        // Filtra pelos intervalos de datas
        chamados = chamados.filter(c => {
          const data = new Date(c.dataAbertura)
          return data >= new Date(dataInicial) && data <= new Date(dataFinal)
        })

        this.chamados = chamados

        // ===== Chamados por status =====
        const statusMap = {}
        chamados.forEach(c => {
          const key = c.status || 'Sem Status'
          if (!statusMap[key]) statusMap[key] = { nome: key, qtd: 0, cor: '' }
          statusMap[key].qtd++
        })
        // Adiciona cores (você pode ajustar)
        const cores = { 'Aberto': 'orange', 'Em Andamento': 'amber', 'Fechado': 'green', 'Sem Status': 'grey' }
        this.chamadosStatus = Object.values(statusMap).map(s => ({ ...s, cor: cores[s.nome] || 'grey' }))

        // ===== Ranking responsáveis =====
        // Para simplificação, vamos assumir que cada chamado tem "responsável" (por enquanto vamos usar "cliente")
        const rankingMap = {}
        chamados.forEach(c => {
          const nome = c.cliente || 'Sem Cliente'
          if (!rankingMap[nome]) rankingMap[nome] = 0
          rankingMap[nome]++
        })
        this.ranking = Object.entries(rankingMap)
          .map(([nome, chamados]) => ({ nome, chamados }))
          .sort((a, b) => b.chamados - a.chamados)
          .slice(0, 8) // top 8

        // ===== Chamados por departamento =====
        const depMap = {}
        chamados.forEach(c => {
          const dep = c.departamento || 'Sem Departamento'
          if (!depMap[dep]) depMap[dep] = 0
          depMap[dep]++
        })
        const coresDep = ['blue', 'orange', 'green', 'red']
        let i = 0
        this.departamentos = Object.entries(depMap).map(([nome, qtd]) => {
          const cor = coresDep[i % coresDep.length]
          i++
          return { nome, qtd, cor }
        })

      } catch (err) {
        console.error('Erro ao buscar chamados:', err)
      } finally {
        this.loading = false
      }
    }
  }
})

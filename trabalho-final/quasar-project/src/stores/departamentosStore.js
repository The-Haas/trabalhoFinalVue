// src/stores/departamentosStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const API = 'http://localhost:3000/departamentos'

export const useDepartamentosStore = defineStore('departamentosStore', {
  state: () => ({
    departamentos: []
  }),

  actions: {
    async listar() {
      try {
        const res = await axios.get(API)
        this.departamentos = res.data
      } catch (err) {
        console.error('Erro ao listar departamentos:', err)
      }
    },

    async criar(departamento) {
      try {
        await axios.post(API, departamento)
        await this.listar()
      } catch (err) {
        console.error('Erro ao criar departamento:', err)
      }
    },

    async atualizar(id, departamento) {
      try {
        await axios.put(`${API}/${id}`, departamento)
        await this.listar()
      } catch (err) {
        console.error('Erro ao atualizar departamento:', err)
      }
    },

    async remover(id) {
      try {
        await axios.delete(`${API}/${id}`)
        await this.listar()
      } catch (err) {
        console.error('Erro ao remover departamento:', err)
      }
    }
  }
})

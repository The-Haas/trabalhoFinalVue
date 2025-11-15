import { defineStore } from 'pinia'
import axios from 'axios'

export const useChamadosStore = defineStore('chamadosStore', {
  state: () => ({
    lista: [],
    carregando: false
  }),

  actions: {

    // Buscar todos os chamados
    async carregarChamados() {
      this.carregando = true
      try {
        const { data } = await axios.get('http://localhost:3000/chamados')

        // 🔥 GARANTE QUE TODOS OS IDs SÃO NÚMEROS
        this.lista = data.map(c => ({
          ...c,
          id: Number(c.id)
        }))

      } catch (error) {
        console.error('Erro ao carregar chamados:', error)
      }

      this.carregando = false
    },

    // Criar novo chamado
    async criarChamado(chamado) {

      // 🔥 Garante que NUNCA será string
      const ids = this.lista.map(c => Number(c.id))
      const novoId = ids.length ? Math.max(...ids) + 1 : 1

      const novoChamado = { 
        ...chamado, 
        id: Number(novoId)   // ← garante número
      }

      await axios.post('http://localhost:3000/chamados', novoChamado)

      this.lista.push(novoChamado)
      return true
    },

    // Editar chamado existente
    async editarChamado(chamado) {

      const chamadoCorrigido = {
        ...chamado,
        id: Number(chamado.id)   // ← evita string no PUT
      }

      await axios.put(`http://localhost:3000/chamados/${chamadoCorrigido.id}`, chamadoCorrigido)

      const index = this.lista.findIndex(c => c.id === chamadoCorrigido.id)
      if (index !== -1) this.lista[index] = chamadoCorrigido

      return true
    },

// Excluir chamado (store)
async excluirChamado(id) {
  try {
    const numericId = Number(id)
    console.log('[STORE] excluirChamado chamado com id:', numericId)

    // checar se existe antes de enviar o DELETE (apenas para debug)
    const existe = this.lista.some(c => Number(c.id) === numericId)
    console.log('[STORE] existe no this.lista?', existe)

    // envia DELETE (garantindo que o id seja number na URL)
    await axios.delete(`http://localhost:3000/chamados/${numericId}`)

    // atualiza lista local
    this.lista = this.lista.filter(c => Number(c.id) !== numericId)

    console.log('[STORE] exclusão OK, lista atualizada')
    return true
  } catch (err) {
    console.error('[STORE] erro ao excluir chamado:', err)
    // opcional: rethrow para o caller tratar
    throw err
  }
}

  }
})

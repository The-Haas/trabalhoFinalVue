import { defineStore } from 'pinia'
import axios from 'axios'
import { Notify } from 'quasar'

export const useResponsaveisStore = defineStore('responsaveis', {
    state: () => ({
        responsaveis: [],
        loading: false,
        apiUrl: 'http://localhost:3000/responsaveis'
    }),

    actions: {
        async getAll() {
            try {
                this.loading = true
                const response = await axios.get(this.apiUrl)
                this.responsaveis = response.data
            } catch (error) {
                // registra o erro no console para debug e evita warning do ESLint
                console.error('getAll responsaveis error:', error)
                Notify.create({
                    type: 'negative',
                    message: 'Erro ao carregar responsáveis'
                })
            } finally {
                this.loading = false
            }
        },
        async create(data) {
            data.ativo = data.ativo ?? true

            try {
                const response = await axios.post(this.apiUrl, data)
                this.responsaveis.push(response.data)

                Notify.create({
                    type: 'positive',
                    message: 'Responsável cadastrado com sucesso!'
                })
            } catch (error) {
                console.error('create responsavel error:', error)
                Notify.create({
                    type: 'negative',
                    message: 'Erro ao cadastrar responsável'
                })
            }
        },

        async update(id, data) {
            try {
                await axios.put(`${this.apiUrl}/${id}`, data)

                const index = this.responsaveis.findIndex(r => r.id === id)
                if (index !== -1) {
                    this.responsaveis[index] = { ...data, id }
                }

                Notify.create({
                    type: 'positive',
                    message: 'Responsável atualizado com sucesso!'
                })
            } catch (error) {
                console.error('update responsavel error:', error)
                Notify.create({
                    type: 'negative',
                    message: 'Erro ao atualizar responsável'
                })
            }
        },

        async delete(id) {
            try {
                await axios.delete(`${this.apiUrl}/${id}`)
                this.responsaveis = this.responsaveis.filter(r => r.id !== id)

                Notify.create({
                    type: 'positive',
                    message: 'Responsável excluído com sucesso!'
                })
            } catch (error) {
                console.error('delete responsavel error:', error)
                Notify.create({
                    type: 'negative',
                    message: 'Erro ao excluir responsável'
                })
            }
        }
    }
})

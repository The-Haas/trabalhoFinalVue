import { defineStore } from 'pinia'
import axios from 'axios'

export const useRegisterStore = defineStore('registerStore', {
  actions: {
    async cadastrar(email, senha) {
      try {
        // 1. Buscar todos os usuários
        const { data: lista } = await axios.get('http://localhost:3000/login')

        // 2. Verificar se já existe email igual
        const existe = lista.find(u => u.email.toLowerCase() === email.toLowerCase())

        if (existe) {
          return { ok: false, msg: 'Email já cadastrado!' }
        }

        // 3. Gerar ID sequencial
        const ids = lista.map(u => Number(u.id)).filter(id => !isNaN(id))
        const ultimoId = ids.length > 0 ? Math.max(...ids) : 0
        const novoId = ultimoId + 1

        // 4. Criar usuário no backend
        const novoUsuario = {
          id: novoId,
          email,
          senha
        }

        await axios.post('http://localhost:3000/login', novoUsuario)

        return { ok: true }

      } catch (err) {
        console.error(err)
        return { ok: false, msg: 'Erro ao cadastrar!' }
      }
    }
  }
})

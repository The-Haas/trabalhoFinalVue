import { defineStore } from 'pinia'
import axios from 'axios'

export const useLoginStore = defineStore('loginStore', {
  state: () => ({
    usuario: null
  }),

  actions: {
    async login(email, senha) {
      try {
        // buscar todos
        const { data } = await axios.get('http://localhost:3000/login')

        // filtrar manualmente
        const usuario = data.find(
          u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.senha === senha
        )

        if (!usuario) {
          return false
        }

        this.usuario = usuario
        return true

      } catch (err) {
        console.error(err)
        return false
      }
    }
  }
})

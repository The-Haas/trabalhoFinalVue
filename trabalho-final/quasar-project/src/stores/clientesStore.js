import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useClientesStore = defineStore('clientesStore', () => {
    const api = 'http://localhost:3000/clientes'

    const clientes = ref([])
    const filtro = ref('')
    const loading = ref(false)

    // ===== Carregar clientes do JSON Server =====
    async function carregarClientes() {
        try {
            loading.value = true
            const response = await axios.get(api)

            clientes.value = response.data.map(c => ({
                id: c.id,
                razaoSocial: c.razao_social,
                nomeFantasia: c.nome_fantasia,
                cnpj: c.cnpj,
                email: c.email,
                telefone: c.telefone,
                ativo: c.status
            }))

        } catch (error) {
            console.error('Erro ao carregar clientes:', error)
        } finally {
            loading.value = false
        }
    }

    // ===== Criar cliente =====
    async function criarCliente(cliente) {
        // Garantir que os clientes já estão carregados
        await carregarClientes()

        // Encontrar o maior ID atual
        const maiorId = clientes.value.length
            ? Math.max(...clientes.value.map(c => c.id))
            : 0

        // Criar novo cliente com ID na PRIMEIRA posição
        const backend = {
            id: maiorId + 1,
            razao_social: cliente.razaoSocial,
            nome_fantasia: cliente.nomeFantasia,
            cnpj: cliente.cnpj,
            email: cliente.email,
            telefone: cliente.telefone,
            status: cliente.ativo
        }

        await axios.post(api, backend)
        await carregarClientes()
    }

    // ===== Atualizar cliente =====
    async function atualizarCliente(cliente) {
        const backend = {
            razao_social: cliente.razaoSocial,
            nome_fantasia: cliente.nomeFantasia,
            cnpj: cliente.cnpj,
            email: cliente.email,
            telefone: cliente.telefone,
            status: cliente.ativo
        }

        await axios.put(`${api}/${cliente.id}`, backend)
        await carregarClientes()
    }

    // ===== Excluir =====
    async function excluirCliente(id) {
        await axios.delete(`${api}/${id}`)
        await carregarClientes()
    }

    // ===== Filtrar =====
    const clientesFiltrados = computed(() =>
        clientes.value.filter(c => {
            const razao = c.razaoSocial?.toLowerCase() || ''
            const fantasia = c.nomeFantasia?.toLowerCase() || ''
            const cnpj = c.cnpj || ''

            const termo = filtro.value.toLowerCase()

            return (
                razao.includes(termo) ||
                fantasia.includes(termo) ||
                cnpj.includes(filtro.value)
            )
        })
    )

    return {
        clientes,
        filtro,
        loading,
        clientesFiltrados,
        carregarClientes,
        criarCliente,
        atualizarCliente,
        excluirCliente
    }
})

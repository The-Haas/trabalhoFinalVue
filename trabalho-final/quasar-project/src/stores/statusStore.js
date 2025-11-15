import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useStatusStore = defineStore("statusStore", () => {
  const status = ref([]);

  const listar = async () => {
    const res = await axios.get("http://localhost:3000/status_chamados");
    status.value = res.data;
  };

  const criar = async (novoStatus) => {
    const res = await axios.post("http://localhost:3000/status_chamados", novoStatus);
    status.value.push(res.data);
  };

  const atualizar = async (id, dados) => {
    const res = await axios.put(`http://localhost:3000/status_chamados/${id}`, dados);
    const i = status.value.findIndex(s => s.id === id);
    if (i !== -1) status.value[i] = res.data;
  };

  const remover = async (id) => {
    await axios.delete(`http://localhost:3000/status_chamados/${id}`);
    status.value = status.value.filter(s => s.id !== id);
  };

  return {
    status,
    listar,
    criar,
    atualizar,
    remover
  };
});

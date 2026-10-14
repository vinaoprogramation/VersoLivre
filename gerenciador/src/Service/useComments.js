import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import api from './api';

const BASE_URL = "http://localhost:3000/comments";

const useComments = create(
  devtools((set, get) => ({
    comentarios: [],
    listaComentarios: async (id_postagem) => {

      try {

        const response = await api.get(`${BASE_URL}/list/${id_postagem}`);

        const answer = await response.data;

        if (answer && answer.comentarios) {
          set({ comentarios: answer.comentarios });

          return true;
        }

        return false;

      } catch (error) {
        console.error("Erro ao listar comentários da postagem", error);
        return false;
      }

    },

    adicionaComentario: async (id_postagem, mensagem) => {

      try {

        const response = await api.post(`${BASE_URL}/send/${id_postagem}`, {
          mensagem: mensagem
        });

        if (response.status === 200) {
          return true;
        }

        return false;

      } catch (error) {
        console.error("Erro ao adicionar comentário", error);
        return false;
      }

    },

    deletaComentario: async (id_postagem) => {

      try {

        const response = await api.delete(`${BASE_URL}/delete/${id_postagem}`);

        if (response.status === 204) {
          return true;
        }

        return false;

      } catch (error) {
        console.error("Erro ao deletar comentário da postagem", error);
        return false;
      }

    },

  })))

export default useComments;
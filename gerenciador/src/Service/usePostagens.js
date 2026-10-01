import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import api from './api';

const BASE_URL = "http://localhost:3000/posts";

const usePostagens = create(
  devtools((set, get) => ({

    postagens: [],
    postagem: null,
    idPostagem: null,

    carregaPostagens: async (offset) => {

      let numero = 1;

      if (offset) {
        numero = offset;
      }

      try {
        const response = await api.get(`${BASE_URL}/${numero}`)

        const answer = await response.data;

        if (!answer || !answer.postagens) {
          console.error("Erro ao processar resposta da requisição(HOMESCREEN)")
          return;
        }


        if (answer.postagens) {
          set({ postagens: answer.postagens }, false, "carregaPostagens");
          return true;
        }


      } catch (error) {
        console.error("Erro ao carregar as postagens");
        return;
      }
    },

    carregaPostagem: async (id_postagem) => {

      try {
        const response = await api.get(`${BASE_URL}/single/${id_postagem}`)

        const answer = await response.data;

        if (!answer || !answer.postagem) {
          console.error("Erro ao processar resposta da requisição(DETAILSCREEN)")
          return;
        }

        if (answer.postagem) {
          set({ postagem: answer.postagem }, false, "carregaPostagem");
          return true;
        }




      } catch (error) {
        console.error("Erro ao carregar a postagem");
        return;
      }
    },

    setIdPostagem: (id_postagem) => {

      try {

        if (!id_postagem) {
          return false;
        }

        const id = parseInt(id_postagem)

        if (id <= 0 || !(Number.isInteger(id))) {
          return false;
        }

        set({ idPostagem: id }, false, "setIdPostagem")

        return true;

      } catch (error) {
        console.error("Erro ao setar o ID")
        return false;
      }
    },

    enviaRascunho: async (titulo, genero, conteudo) => {

      try {
        const response = await api.post(`${BASE_URL}/sketch`, {
          titulo_postagem: titulo,
          genero_postagem: genero,
          conteudo_postagem: conteudo
        })

        const answer = await response.data;

        if (!answer) {
          console.error("Erro ao processar resposta da requisição(RASCUNHO)")
          return false;
        }

        return true;

      } catch (error) {
        console.error("Erro ao enviar rascunho", error);
        return false;
      }

    },

    carregaRascunho: async () => {
      
    }



  })))

export default usePostagens;
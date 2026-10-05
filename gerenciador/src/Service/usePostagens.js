import { create } from 'zustand';
import { devtools } from 'zustand/middleware'

import api from './api';

const BASE_URL = "http://localhost:3000/posts";

const usePostagens = create(
  devtools((set, get) => ({

    postagens: [],
    postagem: null,
    idPostagem: null,
    idRascunho: null,
    rascunhos: [],
    rascunho: null,

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
      if(get().idPostagem === id_postagem){
        return true;
      }

      if(get().idPostagem !== id_postagem){
        set({ idPostagem: null }, false, "setIdPostagem")
      }

      try {

        if (!id_postagem) {
          return false;
        }

        const id = parseInt(id_postagem)

        if (id <= 0 || !(Number.isInteger(id))) {
          return false;
        }

        console.log("ID Agora: ", id)

        set({ idPostagem: id }, false, "setIdPostagem")

        return true;

      } catch (error) {
        console.error("Erro ao setar o ID")
        return false;
      }
    },


    setIdRascunho: (id_rascunho) => {
      if(get().idRascunho === id_rascunho){
        return true;
      }

      if(get().idRascunho !== id_rascunho){
        set({ idRascunho: null, rascunho:null }, false, "setIdRascunho")
      }

      try {

        if (!id_rascunho) {
          return false;
        }

        const id = parseInt(id_rascunho)

        if (id <= 0 || !(Number.isInteger(id))) {
          return false;
        }

        console.log("Id foi aprovado")

        set({ idRascunho: id }, false, "setIdRascunho")

        return true;

      } catch (error) {
        console.error("Erro ao setar o ID")
        return false;
      }
    },

    enviaRascunho: async (titulo, genero, conteudo, file) => {

      try {
        const response = await api.post(`${BASE_URL}/sketch`, {
          titulo_postagem: titulo,
          genero_postagem: genero,
          conteudo_postagem: conteudo
        })

        const answer = await response.data;

        if (!answer || !answer.id_postagem) {
          console.error("Erro ao processar resposta da requisição(RASCUNHO)")
          return false;
        }

        set({ idRascunho: answer.id_postagem }, false, "setIdRascunho")
        console.log("ID SETADO: ", get().idRascunho)


        if (file) {
          const id_postagem = get().idRascunho;

          if (!id_postagem) {
            console.error("Erro ao processar resposta da requisição(RASCUNHO)")
            return false;
          }

          const formData = new FormData();
          formData.append('imagem_postagem', file);

          const imageResponse = await api.put(`${BASE_URL}/file/${id_postagem}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          )

          const imageAnswer = await imageResponse.data;

          if (!imageAnswer || !imageAnswer.mensagem) {
            console.error("Erro ao processar resposta da requisição(IMAGEM)")
            return false;
          }

          if (imageAnswer.mensagem) {
            const setRascunho = await get().carregaRascunho(id_postagem);

            if (!setRascunho) {
              console.error("Erro ao setar rascunho")
              return false;
            }
          }

          return true;
        }

        const setRascunho = await get().carregaRascunho(get().idRascunho);

        if (!setRascunho) {
          console.error("Erro ao setar rascunho")
          return false;
        }

        return true;



      } catch (error) {
        console.error("Erro ao enviar rascunho", error);
        return false;
      }

    },


    carregaRascunho: async (idRascunho) => {

      let id;

      const id_rascunho = get().idRascunho;

      if(id_rascunho){
        id = id_rascunho;
      } else{
        id = idRascunho;
      }

      if (!id || id <= 0 || !(Number.isInteger(id))) {
        console.error("Erro ao carregar rascunho, id_rascunho inválido")
        return false;
      }

      set({ idRascunho: id }, false, "setIdRascunho")
      try {

        const id_rascunho = get().idRascunho;

        const response = await api.get(`${BASE_URL}/sketch/${id_rascunho}`)

        const answer = await response.data;

        console.log("Resposta da requisição: ", answer)

        if (!answer || !answer.rascunho) {
          console.error("Erro ao processar resposta da requisição(CARREGA RASCUNHO)")
          return false;
        }

        if (answer.rascunho) {
          set({ rascunho: answer.rascunho }, false, "carregaRascunho");
          console.log("Rascunho que foi setado: ", get().rascunho)
          return true;
        }


      } catch (error) {
        console.error("Erro ao carregar rascunho", error);
        return false;
      }
    },

    carregaRascunhos: async () => {
      try {

        const response = await api.get(`${BASE_URL}/sketches`)

        const answer = await response.data;

        if (!answer || !answer.rascunhos) {
          console.error("Erro ao processar resposta da requisição(CARREGA RASCUNHOS)")
          return false;
        }

        if (answer.rascunhos) {
          set({ rascunhos: answer.rascunhos }, false, "carregaRascunhos");
          return true;
        }

      } catch (error) {
        console.error("Erro ao carregar rascunhos", error);
        return false;
      }
    },

    atualizaRascunho: async (titulo_postagem, genero_postagem, conteudo_postagem, file) => {

      const id_rascunho = get().idRascunho;

      try {

        if (!id_rascunho || id_rascunho <= 0 || !(Number.isInteger(id_rascunho))) {
          console.error("Erro ao atualizar rascunho, id_rascunho inválido")
          return false;
        }

        console.log(id_rascunho, titulo_postagem, genero_postagem, conteudo_postagem)

        const response = await api.put(`${BASE_URL}/update/${id_rascunho}`, {
          titulo_postagem: titulo_postagem,
          genero_postagem: genero_postagem,
          conteudo_postagem: conteudo_postagem
        })

        if (!response || response.status !== 201) {
          console.error("Erro ao processar resposta da requisição(ATUALIZA RASCUNHO)")
          return false;
        }

        if (file) {
          const formData = new FormData();
          formData.append('imagem_postagem', file);

          const imageResponse = await api.put(`${BASE_URL}/file/${get().idRascunho}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          )

          const imageAnswer = await imageResponse.data;

          if (!imageAnswer || !imageAnswer.mensagem) {
            console.error("Erro ao processar resposta da requisição(IMAGEM)")
            return false;
          }

          if (imageAnswer.mensagem) {
            const setRascunho = await get().carregaRascunho(id_postagem);

            if (!setRascunho) {
              console.error("Erro ao setar rascunho")
              return false;
            }
          }


        }

        const setRascunho = await get().carregaRascunho(get().idRascunho);

        if (!setRascunho) {
          console.error("Erro ao setar rascunho")
          return false;
        }
        return get().carregaRascunho();

      } catch (error) {
        console.error("Erro ao atualizar rascunho", error);
        return false;
      }

    },

    anulaRascunho: async () => {

      set({rascunho: null, idRascunho: null}, false, "anulaRascunho");

    },
    
  })))

export default usePostagens;
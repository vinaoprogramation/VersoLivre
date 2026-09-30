import { create } from 'zustand';

import { storeToken, removeToken } from './authStorage'

import api from './api';


const BASE_URL = "http://localhost:3000/user";

const useAutenticacao = create((set, get) => ({
  autenticado: false,

  login: async(email, senha) => {
    if(!email || !senha){
      return;
    }

    try{
      const response = await api.post(`${BASE_URL}/auth`,{
          email_user: email,
          senha_user: senha
        }
      )

      const answer = await response.data;

      if(!answer || !answer.token){
        console.error("Erro ao processar resposta da requisição(LOGIN)")
        return;
      }

      const setToken = await storeToken(answer.token);

      if(setToken){
        set({autenticado: true}); 
        return true;
      }

      
    }catch(error){
      console.error("Erro no login");
      return;
    }
  }

}))

export default useAutenticacao
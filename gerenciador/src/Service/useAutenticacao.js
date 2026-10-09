import { create } from 'zustand';

import { storeToken, getToken, removeToken } from './authStorage'

import api from './api';

import { TOKEN_KEY } from './authStorage';

const BASE_URL = "http://localhost:3000/user";

const useAutenticacao = create((set, get) => ({
  autorizacao: null,
  adminList: [],
  dados: null,

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

      const payload = await get().retornaToken()

      if(payload.role_user == 'admin'){
        set({autorizacao: 'admin'})
        localStorage.setItem('at', 'admin')
      }
      else if(payload.role_user == 'user'){
        set({autorizacao: 'user'})
        localStorage.setItem('at', 'user')
      } else{
        return false;
      }

      if(setToken){
        const responseUser = await api.get(`${BASE_URL}/data`);

        const answer = await responseUser.data;

        if(answer && answer.dados_usuario){
          set({dados: answer.dados_usuario});
          return true;
        }

        return false;
      }

      return false

      
    }catch(error){
      console.error("Erro no login", error);
      return;
    }
  },


  cadastro: async(nome, email, senha) => {
    if(!nome || !email || !senha){
      return;
    }

    try{
      const response = await api.post(`${BASE_URL}/post`,{
          nome_user: nome,
          email_user: email,
          senha_user: senha
        }
      )

      if(response.status === 201){
        const loga = await get().login(email, senha);
        if(loga){
          return true;
        }
      }

      return false;

      
    }catch(error){
      console.error("Erro no login", error);
      return false;
    }
  },

  retornaToken: async () => {

    const token = await getToken();

    if(!token){
      return null;
    }

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    const base64Url = cleanToken.split('.')[1];

    const base64 = base64Url.replace(/-/g, '+').replace(/-/g, '/');

    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c){
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);

  },

  listaAdmins: async () => {

    try {

      const response = await api.get(`${BASE_URL}/admins`);

      const answer = await response.data;

      if(answer && answer.admins){
        set({adminList: answer.admins});
        return true;      
      }

      return false;
      
    } catch (error) {
      console.error("Erro ao listar administradores");
      return false
    }

  },


  alteraRole: async (role, id_user) => {

    try {

      const response = await api.patch(`${BASE_URL}/switch/${id_user}`,{
        role: role,
      });

      if(response && response.status == 200){
        return true;
      }

      return false;
      
    } catch (error) {
      console.error("Erro ao listar administradores");
      return false
    }
  },

  cadastra: async (nome_user, email_user, senha_user, role_user) => {

    try {
      
      const response = await api.post(`${BASE_URL}/post/manual`,{
        nome_user: nome_user,
        email_user: email_user,
        senha_user: senha_user,
        role_user: role_user,
      })

      if(response && response.status == 201){
        return true;
      }

      return false;

    } catch (error) {
      console.error(error);
      return false
    }

  } 

}))

export default useAutenticacao
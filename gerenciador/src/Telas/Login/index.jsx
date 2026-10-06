import React,{useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom';

import useAutenticacao from "../../Service/useAutenticacao";

import styles from './styles.module.css'
import usePostagens from "../../Service/usePostagens";

export default function Login(){
  const login = useAutenticacao((state) => state.login);
  const autenticado = useAutenticacao((state) => state.autenticado);
  const anulaRascunhos = usePostagens((state) => state.anulaRascunhos)

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazLogin = async (email, senha) => {
    if(!email || !senha){
      return;
    }

    if(login){
      anulaRascunhos();
      const loga = await login(email, senha);
      if(loga){
          navigate('/HomeScreen')
      }
    }
  }

  return <>
  <div className={styles.fundo}>
    <div className={styles.entrada}>
      <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      type="email"
      className={styles.input}
      />

      <input
      placeholder="Senha"
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
      type="password"
      className={styles.input}
      />

      <button
        className={styles.botao}
        onClick={() => {
          fazLogin(email, senha)
        }}

      >
        <p className={styles.textoBotao}>Entrar</p>
      </button>

      <button
        className={styles.botaoTexto}
        onClick={() => {
          navigate('/Cadastro')
        }}
        >
        <p className={styles.textoCadastro}>Cadastrar</p>
        </button>
    </div>
  </div>
    
  </>
}
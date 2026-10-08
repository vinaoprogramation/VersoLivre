import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import useAutenticacao from "../../Service/useAutenticacao";

import styles from './styles.module.css'

export default function Cadastro() {
  const cadastro = useAutenticacao((state) => state.cadastro);
  const autenticado = useAutenticacao((state) => state.autenticado);

  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazCadastro = async (nome, email, senha) => {
    if (!nome || !email || !senha) {
      return;
    }

    if (cadastro) {
      const cadastrado = await cadastro(nome, email, senha);
      if (cadastrado) {
        navigate('../HomeScreen')
      }
    }
  }

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>
        <h1>Cadastro</h1>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          type="text"
          className={styles.input}
        />

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
            fazCadastro(nome, email, senha)
          }}

        >
          <p className={styles.textoBotao}>Cadastrar</p>
        </button>
      </div>
    </div>

  </>
}
import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css'
import useAutenticacao from "../../Service/useAutenticacao";

export default function Usuarios() {
  const adminList = useAutenticacao((state) => state.adminList);
  const listaAdmins = useAutenticacao((state) => state.listaAdmins);
  const alteraRole = useAutenticacao((state) => state.alteraRole);
  const dados = useAutenticacao((state) => state.dados);
  const cadastra = useAutenticacao((state) => state.cadastra);

  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("user" || "admin");

  const fazCadastro = async (nome, email, senha, role) => {
    if (!nome || !email || !senha || !role) {
      return;
    }

    if (cadastra) {
      const cadastrando = await cadastra(nome, email, senha, role);
      if (cadastrando) {
        alert("Usuário cadastrado com sucesso")
        listaAdmins()
      }
    }
  }

  useEffect(() => {
    listaAdmins();
  }, [])

  const altera = async(role, id_user) =>{
    if(!role || !id_user){
      alert("Faltam parâmetros")
      return;
    }

    const alterando = await alteraRole(role, id_user);

    if(alterando){
      alert("Administrador foi rebaixado a usuário");
      listaAdmins()
      return;
    }

    alert("Erro")
    return;
  }

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>
        <div className={styles.usersContainer}>

          {
            adminList && adminList.length !== 0 ?
              <>

                {
                  adminList.map((item) => <>
                    {
                      item.email_user != dados.email_user ?
                        <div className={styles.userContainer}
                          key={item.id_user}
                        >
                          <h2 className={styles.nomeUser}
                          >
                            {item.nome_user}
                          </h2>

                          <h3 className={styles.nomeUser}
                          >
                            {item.email_user}
                          </h3>


                          <div className={styles.containerBotao}>
                            <button className={styles.botao}
                            onClick={() => {
                              altera("user", item.id_user)
                            }}
                            >
                              <p className={styles.textoBotao}>
                                Rebaixar a Usuário
                              </p>
                            </button>

                          </div>

                        </div>
                        :
                        <div className={styles.userContainerOpaco}
                          key={item.id_user}
                        >
                          <h2 className={styles.nomeUser}
                          >
                            Você
                          </h2>

                        </div>
                    }


                  </>)
                }

              </>

              :

              <>
                <h2>
                  Não há outros usuários no momento
                </h2>
              </>
          }

        </div>

        <div className={styles.containerEntrada}>
          <h3 className={styles.tituloEntrada}>Cadastro de novo usuário</h3>
          <div className={styles.entradaDados}>
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

            <div className={styles.containerEscolha}>
              <label>
                Tipo de Usuário:
                <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.selecao}>
                  <option value="user" className={styles.opcao}>Usuário Comum</option>
                  <option value="admin" className={styles.opcao}>Administrador</option>
                </select>
              </label>
            </div>


            <button
              className={styles.botaoCadastro}
              onClick={() => {
                fazCadastro(nome, email, senha, role)
              }}

            >
              <p className={styles.textoBotaoCadastro}>Cadastrar</p>
            </button>
          </div>
        </div>



      </div>
    </div>

  </>
}
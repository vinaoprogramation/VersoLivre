import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css'

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";


import usePostagens from "../../Service/usePostagens";

export default function VisualizacaoPostagem() {
  const carregaRascunho = usePostagens((state) => state.carregaRascunho);
  const rascunho = usePostagens((state) => state.rascunho);
  const idRascunho = usePostagens((state) => state.idRascunho);
  const decideStatusPostagem = usePostagens((state) => state.decideStatusPostagem);

  const navigate = useNavigate();

  useEffect(() => {
    if (carregaRascunho) {
      if (idRascunho && idRascunho != null && idRascunho != localStorage.getItem('id_visualizar')) {
        carregaRascunho()
      } else {
        carregaRascunho(localStorage.getItem('id_visualizar'))
      }
    }
  }, [])

  useEffect(() => {
    if (idRascunho != null) {
      localStorage.setItem('id_visualizar', idRascunho)
    }

  }, [idRascunho])




  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const spaces = '     ';

      const novoConteudo = observacao.substring(0, start) + spaces + observacao.substring(end);

      setObservacao(novoConteudo);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 5;
      }, 0);
    }
  };

  const [observacao, setObservacao] = useState('');

  const decide = async (id_postagem, status, mensagem) => {

    if (!id_postagem || !status) {
      alert("Erro")
      return;
    }

    const decisao = await decideStatusPostagem(id_postagem, status, mensagem);

    if (!decisao) {
      alert("Erro interno")
      return;
    }

    alert("Decisão enviada");
    navigate("/Rascunhos")
    return;

  }

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>
        {
          rascunho && rascunho != null ?
            <>
              <div className={styles.container}>

                <div className={styles.containerCabecalho}>
                  <h1 className={styles.titulo}>{rascunho.titulo_postagem}</h1>

                  <h2 className={styles.genero}>{rascunho.genero_postagem}</h2>

                  <h3 className={styles.classificacao}>{rascunho.classificacao_indicativa_postagem}</h3>
                </div>


                <div className={styles.containerConteudo}>
                  <p className={styles.texto}>
                    {rascunho.conteudo_postagem}
                  </p>
                </div>

              </div>


              <div className={styles.containerAprovacao}>

                <h1 className={styles.tituloAprovacao}>Aprovação</h1>

                <div>
                  <h5 className={styles.tituloObservacao}>Adicione uma observação</h5>
                  <textarea
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    cols={5}
                    onKeyDown={handleKeyDown}
                    className={styles.observacao}
                    placeholder="Observação..."
                  />
                </div>

                <div className={styles.containerBotoes}>


                  <button className={styles.botaoAprovar}
                    onClick={() => {
                      decide(rascunho?.id_postagem, "aprovada", observacao)
                    }}>
                    Aprovar
                  </button>

                  <button className={styles.botaoRejeitar}
                    onClick={() => {
                      decide(rascunho.id_postagem, "recusada", observacao)
                    }}>
                    Rejeitar
                  </button>

                </div>
              </div>


            </>
            :
            null
        }
      </div>
    </div>

  </>
}
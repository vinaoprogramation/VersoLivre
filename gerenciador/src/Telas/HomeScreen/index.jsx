import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css'

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";

import iconeAdicionar from '../../assets/plus-square.png'
import pasta from '../../assets/write.png'

import usePostagens from "../../Service/usePostagens";
import useAutenticacao from "../../Service/useAutenticacao";

export default function HomeScreen() {
  const carregaPostagens = usePostagens((state) => state.carregaPostagens);
  const postagens = usePostagens((state) => state.postagens);
  const rascunhos = usePostagens((state) => state.rascunhos);
  const carregaRascunhos = usePostagens((state) => state.carregaRascunhos);
  const setIdPostagem = usePostagens((state) => state.setIdPostagem);
  const setIdRascunho = usePostagens((state) => state.setIdRascunho);
  const anulaRascunho = usePostagens((state) => state.anulaRascunho);
  const autorizacao = useAutenticacao((state) => state.autorizacao);

  const navigate = useNavigate();

  useEffect(() => {
    if (carregaPostagens) {
      carregaPostagens();
    }
    if (carregaRascunhos) {
      carregaRascunhos();
    }
  }, [])

  const [permissao, setPermissao] = useState('user')

  useEffect(() => {
    const buscaAt = () => {
      if(autorizacao){
        setPermissao(autorizacao)
      } else{
        setPermissao(localStorage.getItem('at'))
      }
    }
    buscaAt()
  }, [])

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>


        {
          rascunhos && rascunhos.length > 0 ?
            <>
              <h1 className={styles.tituloRascunhos}>Rascunhos</h1>

              <div className={styles.rascunhosContainer}>
                {rascunhos.map((item) => <>
                  <div className={styles.rascunhoItem}
                    key={item.id_postagem}
                    onClick={async () => {
                      const setaId = await setIdRascunho(item?.id_postagem);
                      if (setaId) {
                        navigate(`/Adicionar/Postagem`)
                      }
                    }}
                  >
                    <h2 className={styles.tituloRascunho}>
                      {item.titulo_postagem}
                    </h2>
                    <p className={styles.conteudoRascunho}>
                      {item.conteudo_postagem}
                    </p>
                  </div>
                </>)}
              </div>

            </>

            :

            null
        }


        {
          postagens ?
            postagens.length > 0 ?
              <>
                {postagens.map((item) => <>
                  <div className={styles.postagemContainer}
                    key={item.id_postagem}
                    onClick={() => {
                      setIdPostagem(item?.id_postagem)
                      navigate(`/DetailScreen/${item.id_postagem}`)

                    }}
                  >
                    <h2 className={styles.tituloPostagem}
                    >
                      {item.titulo_postagem}
                    </h2>
                    <h4 className={styles.generoPostagem} >
                      {item.genero_postagem}
                    </h4>
                    <h5 className={styles.classificacaoPostagem} >
                      {item.classificacao_indicativa_postagem}
                    </h5>
                    <p className={styles.conteudoPostagem} >
                      {item.conteudo_postagem}
                    </p>
                  </div>

                </>)}
              </>
              :
              <div className={styles.containerNulo}>
                <h1 className={styles.textoNulo}>Não há postagens no momento... Adicione uma!</h1>

                <div className={styles.containerBotoes}>
                  <div className={styles.botaoAdicionar}
                    onClick={() => {
                      anulaRascunho();
                      navigate('/Adicionar/Postagem')
                    }}
                  >
                    <img src={iconeAdicionar} className={styles.imagemBotaoAdicionar} />
                  </div>

                  {
                    permissao == 'admin' ?
                      <>
                        <div className={styles.botaoAdicionar}
                          onClick={async() => {
                            navigate('/Rascunhos')
                          }}
                        >
                          <img src={pasta} className={styles.imagemBotaoAdicionar} />
                        </div>
                      </>
                      :
                      null
                  }


                </div>

              </div>

            :
            <>
              <div className={styles.activityContainer}>
                <ActivityIndicator />
              </div>
            </>
        }


      </div>
    </div>

  </>
}
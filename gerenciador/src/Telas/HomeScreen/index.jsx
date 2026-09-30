import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css'

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";

import iconeAdicionar from '../../assets/plus-square.png'

import usePostagens from "../../Service/usePostagens"

export default function HomeScreen() {
  const carregaPostagens = usePostagens((state) => state.carregaPostagens);
  const postagens = usePostagens((state) => state.postagens);
  const setIdPostagem = usePostagens((state) => state.setIdPostagem);

  const navigate = useNavigate();

  useEffect(() => {
    if (carregaPostagens) {
      carregaPostagens();
    }
  }, [carregaPostagens])


  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>

        {
          postagens ?
            postagens.length > 0?
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
              <div className={styles.botaoAdicionar}
              onClick={() => {
                navigate('/Adicionar/Postagem')
              }}
              >
                <img src={iconeAdicionar} className={styles.imagemBotaoAdicionar}/>
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
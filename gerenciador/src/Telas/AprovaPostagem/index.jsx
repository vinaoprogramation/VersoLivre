import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css'

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";

import iconeAdicionar from '../../assets/plus-square.png'
import pasta from '../../assets/write.png'

import usePostagens from "../../Service/usePostagens";

export default function AprovaPostagem() {

  const buscaRascunhos = usePostagens((state) => state.buscaRascunhos);
  const rascunhosAdmin = usePostagens((state) => state.rascunhosAdmin);
  const setIdRascunho = usePostagens((state) => state.setIdRascunho);

  const navigate = useNavigate();

  useEffect(() => {
    buscaRascunhos()
  }, [])

  const imagem = (bytes) => {
    const arquivoBytes = new Uint8Array(bytes.data);
    const blob = new Blob([arquivoBytes], { type: bytes.type });
    const objectUrl = URL.createObjectURL(blob);

    return objectUrl
  }

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>
        <div className={styles.postagensContainer}>
          {
            rascunhosAdmin ?
              rascunhosAdmin.length > 0 ?
                <>
                  {
                    rascunhosAdmin.map((item) => <>
                      <div className={styles.postagemContainer}
                        key={item.id_postagem}
                        onClick={() => {
                          setIdRascunho(item.id_postagem)
                          navigate('/Visualizacao')
                        }}
                      >
                        <div className={styles.textos}>
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
                        </div>

                        <div className={styles.conteudo}>
                          <p className={styles.conteudoPostagem} >
                            {item.conteudo_postagem}
                          </p>
                        </div>

                        <div className={styles.containerImagem}>
                          {
                            item.imagem_postagem ?
                              <>
                                <img src={imagem(item.imagem_postagem)} className={styles.imagemItem} />
                              </>
                              :
                              null
                          }
                        </div>

                      </div>
                    </>)
                  }
                </>
                :
                null
              :
              null
          }
        </div>

      </div>
    </div>

  </>
}
import React, { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom";
import styles from './styles.module.css'

import usePostagens from "../../Service/usePostagens"

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";

export default function DetailScreen() {

  const { idPostagem } = useParams()

  const carregaPostagem = usePostagens((state) => state.carregaPostagem);
  const postagem = usePostagens((state) => state.postagem);

  const postagemAtual =
    postagem && String(postagem.id_postagem) === String(idPostagem)
      ? postagem
      : null;

  useEffect(() => {
    if (carregaPostagem && idPostagem) {

      carregaPostagem(idPostagem);

    }
  }, [carregaPostagem, idPostagem])

  const imageUrl = useMemo(() => {

    if (!postagemAtual?.imagem_postagem?.data) {
      return null;
    }

    const bytes = new Uint8Array(
      postagemAtual.imagem_postagem.data
    )

    const blob = new Blob(
      [bytes],
      { type: "imagem/png" }
    );

    return URL.createObjectURL(blob)

  }, [postagemAtual])

  return <>

    <div className={styles.fundo}>
      <div className={styles.entrada}>

        {
          postagemAtual ?
            <>
              <div className={styles.postagemContainer}
                key={postagemAtual.id_postagem}>
                <h2 className={styles.tituloPostagem}
                >
                  {postagemAtual.titulo_postagem}
                </h2>
                <h4 className={styles.generoPostagem} >
                  {postagemAtual.genero_postagem}
                </h4>
                <h5 className={styles.classificacaoPostagem} >
                  {postagemAtual.classificacao_indicativa_postagem}
                </h5>
                <p className={styles.conteudoPostagem} >
                  {postagemAtual.conteudo_postagem}
                </p>

                {
                  imageUrl && (
                    <div className={styles.containerImagem} >
                      <img
                        src={imageUrl}
                        alt={postagemAtual.tituloPostagem}
                        className={styles.imagem}

                      />

                    </div>

                  )
                }

                <p className={styles.autor}>Por: {postagemAtual.autor_nome}</p>
                
              </div>

              

            </>
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
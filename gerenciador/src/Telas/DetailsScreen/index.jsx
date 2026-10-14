import React, { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom";
import styles from './styles.module.css'

import usePostagens from "../../Service/usePostagens"

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";

import envio from '../../assets/envio.png'

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


  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const spaces = '     ';

      const novoConteudo = conteudo.substring(0, start) + spaces + conteudo.substring(end);

      setConteudo(novoConteudo);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 5;
      }, 0);
    }
  };

  const [conteudo, setConteudo] = useState(() => {
    return localStorage.getItem('conteudo')
  });

  useEffect(() => {
    localStorage.setItem('conteudo', conteudo)
  }, [conteudo])

  const [mostra, setMostra] = useState(false);

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

                <p className={styles.conteudoPostagem} >
                  {postagemAtual.numero_curtidas}
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

              <div className={styles.comentarios}>
                <div className={styles.containerBotoes}>
                  <button className={styles.botaoComentario}
                    onClick={() => {
                      setMostra(true)
                    }}
                  >
                    <p className={styles.textoBotaoComentario}>Adicionar Comentário</p>
                  </button>

                  {
                    mostra ?
                      <>

                        <button className={styles.botaoComentarioExcluir}
                          onClick={() => {
                            setConteudo("")
                            setMostra(false)
                          }}
                        >
                          <p className={styles.textoBotaoComentario}>Excluir Rascunho</p>
                        </button>

                      </>
                      :
                      null
                  }


                </div>


                {
                  mostra ?
                    <>
                      <div>
                        <textarea
                          value={conteudo}
                          onChange={(e) => setConteudo(e.target.value)}
                          onKeyDown={handleKeyDown}
                          cols={5}
                          className={styles.textoConteudo}
                          placeholder="Escreva o seu texto aqui"
                        />


                        <button className={styles.botaoEnvio}
                          onClick={() => {
                            setConteudo("")
                            setMostra(false)
                          }}
                        >
                          <img src={envio} alt="Enviar Comentário" className={styles.imagemEnvio} />
                        </button>
                      </div>

                    </>
                    :
                    null
                }



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
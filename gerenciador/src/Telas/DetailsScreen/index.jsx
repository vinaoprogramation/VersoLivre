import React, { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom";
import styles from './styles.module.css'

import usePostagens from "../../Service/usePostagens"
import useComments from "../../Service/useComments";

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";

import envio from '../../assets/envio.png'

export default function DetailScreen() {

  const { idPostagem } = useParams()

  const carregaPostagem = usePostagens((state) => state.carregaPostagem);
  const postagem = usePostagens((state) => state.postagem);
  const adicionaComentario = useComments((state) => state.adicionaComentario);
  const listaComentarios = useComments((state) => state.listaComentarios);
  const comentarios = useComments((state) => state.comentarios);

  const postagemAtual =
    postagem && String(postagem.id_postagem) === String(idPostagem)
      ? postagem
      : null;

  useEffect(() => {
    const carrega = async () => {
      if (carregaPostagem && idPostagem) {

        await carregaPostagem(idPostagem);

        listaComentarios(idPostagem);

      }
    }

    carrega()

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

      const novoConteudo = comentario.substring(0, start) + spaces + comentario.substring(end);

      setComentario(novoConteudo);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 5;
      }, 0);
    }
  };

  const [comentario, setComentario] = useState(() => {
    return localStorage.getItem('comentario')
  });

  useEffect(() => {
    localStorage.setItem('comentario', comentario)
  }, [comentario])

  const [mostra, setMostra] = useState(false);

  const handleComentario = async (id_postagem, comentario) => {
    if (!id_postagem || !comentario || comentario == "" || comentario.length >1000) {
      alert("Faltam parâmetros")
      return;
    }

    const envia = await adicionaComentario(idPostagem, comentario);

    if (!envia) {
      alert("Erro interno");
      return;
    }

    alert("Comentário enviado com sucesso!")
    listaComentarios(idPostagem);
  }

  const [expande, setExpande] = useState({
    id: null,
    valor: false
  });

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
                    <p className={styles.textoBotaoComentario}>Escrever Comentário</p>
                  </button>

                  {
                    mostra ?
                      <>

                        <button className={styles.botaoComentarioExcluir}
                          onClick={() => {
                            setComentario("")
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
                          value={comentario}
                          onChange={(e) => setComentario(e.target.value)}
                          onKeyDown={handleKeyDown}
                          cols={5}
                          className={styles.textoConteudo}
                          placeholder="Escreva o seu texto aqui"
                        />


                        <button className={styles.botaoEnvio}
                          onClick={() => {
                            handleComentario(postagemAtual.id_postagem, comentario)
                            setComentario("")
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



                {
                  comentarios ?
                    <div className={styles.secaoComentarios}>

                      <h1 className={styles.tituloSecaoComentarios}>Comentários: {comentarios.length}</h1>

                      <div className={styles.listaComentarios}>
                        
                        {comentarios.map((item) => <>
                          <div className={styles.itemComentario} 
                          onClick={async() => {
                            expande.valor?
                              expande.id == item.id_comentario?
                                setExpande({
                                  id: item.id_comentario,
                                  valor: false
                                })
                              :
                              setExpande({
                                id: item.id_comentario,
                                valor: true
                              })
                              :
                            setExpande({
                              id: item.id_comentario,
                              valor: true,
                            })

                          }}>
                            <h3 className={styles.nomeComentario}>{item.nome_user}</h3>
                            <p className={
                              expande.valor && expande.id == item.id_comentario?
                              styles.conteudoComentarioExpandido
                              :
                              styles.conteudoComentario
                              }>{item.mensagem_comentario}</p>
                          </div>
                        </>)}
                      </div>



                    </div>
                    :
                    <p>Erro ao carregar os comentários</p>
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
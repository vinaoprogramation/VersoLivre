import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import useAutenticacao from "../../Service/useAutenticacao";

import usePostagens from "../../Service/usePostagens";

import styles from './styles.module.css'

export default function AdicionarPostagem() {
  const navigate = useNavigate();

  const enviaRascunho = usePostagens((state) => state.enviaRascunho);
  const atualizaRascunho = usePostagens((state) => state.atualizaRascunho);
  const carregaRascunho = usePostagens((state) => state.carregaRascunho);
  const deletaRascunho = usePostagens((state) => state.deletaRascunho);
  const rascunho = usePostagens((state) => state.rascunho);
  const idRascunho = usePostagens((state) => state.idRascunho);

  const [conteudo, setConteudo] = useState(() => {
    return localStorage.getItem('conteudo')
  });

  useEffect(() => {
    localStorage.setItem('conteudo', conteudo)
  }, [conteudo])

  const [genero, setGenero] = useState(() => {
    return localStorage.getItem('genero')
  });


  useEffect(() => {
    localStorage.setItem('genero', genero)
  }, [genero])

  const [titulo, setTitulo] = useState(() => {
    return localStorage.getItem('titulo')
  });

  useEffect(() => {
    localStorage.setItem('titulo', titulo)
  }, [titulo])

  const [id, setId] = useState(() => {
    return localStorage.getItem('id')
  });

  useEffect(() => {
    localStorage.setItem('id', id)
  }, [id])

  useEffect(() => {
    if (carregaRascunho && idRascunho) {
      carregaRascunho(idRascunho);
    }
  }, [carregaRascunho, idRascunho])

  const inicia = async (rascunho) => {
    if (rascunho) {
      console.log("Rascunho que chegou: ", rascunho)
      setTitulo(rascunho.titulo_postagem)
      setGenero(rascunho.genero_postagem)
      setConteudo(rascunho.conteudo_postagem)
      setId(rascunho.id_postagem)
      if (rascunho?.imagem_postagem?.data) {
        const arquivoBytes = new Uint8Array(rascunho?.imagem_postagem?.data);
        const blob = new Blob([arquivoBytes], { type: rascunho?.imagem_postagem?.type });
        const objectUrl = URL.createObjectURL(blob);
        setImagePreview(objectUrl)
      } else {
        if (localStorage.getItem(id)) {
          const carregando = carregaRascunho(id)
          setTitulo(rascunho.titulo_postagem)
          setGenero(rascunho.genero_postagem)
          setConteudo(rascunho.conteudo_postagem)
          setId(rascunho.id_postagem)
          if (rascunho?.imagem_postagem?.data) {
            const arquivoBytes = new Uint8Array(rascunho?.imagem_postagem?.data);
            const blob = new Blob([arquivoBytes], { type: rascunho?.imagem_postagem?.type });
            const objectUrl = URL.createObjectURL(blob);
            setImagePreview(objectUrl)
          }

        }
      }
    }
  }


  useEffect(() => {
    inicia(rascunho)
  }, [rascunho])

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


  const [file, setFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(() => {
    return localStorage.getItem('imagePreview')
  });

  const handleImagem = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl)
      setFile(file);
    }
  }

  useEffect(() => {
    localStorage.setItem('imagePreview', imagePreview)
  }, [imagePreview])

  const handleEnvioRascunho = async (titulo, genero, conteudo, file) => {

    const envia = await enviaRascunho(titulo, genero, conteudo, file);

    if (envia) {
      alert("Rascunho salvo com sucesso")
    }

    console.log(titulo, genero, conteudo, file)
  }

  const handleAtualizaRascunho = async (titulo, genero, conteudo, file) => {

    const atualiza = await atualizaRascunho(titulo, genero, conteudo, file);

    if (atualiza) {
      alert("Rascunho atualizado com sucesso")
    }

    console.log(titulo, genero, conteudo, file)

  }

  const deleta = async () => {

    const deletaAcao = await deletaRascunho();

    if (!deletaAcao) {
      return;
    }

    alert("Postagem deletada com sucesso");

    navigate("../../HomeScreen")
  }

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>
        <div className={styles.entradaConteudo}>
          <h1>Produção</h1>
          <textarea
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            cols={1}
            className={styles.tituloConteudo}
            placeholder="Título"
          />



          <textarea
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            cols={1}
            className={styles.genero}
            placeholder="Escreva o(s) gênero(s) do seu texto. Ex: Romance, Comédia, Poesia, etc"
          />

          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            onKeyDown={handleKeyDown}
            cols={30}
            className={styles.textoConteudo}
            placeholder="Escreva o seu texto aqui"
          />

          <div className={styles.botoes}>
            <div className={styles.containerBotoes}>
              <button className={styles.botao}
                onClick={() => {

                  if (rascunho) {
                    handleAtualizaRascunho(titulo, genero, conteudo, file)
                    return;
                  } else {
                    handleEnvioRascunho(titulo, genero, conteudo, file)
                  }

                }}
              >
                Salvar Rascunho
              </button>

              <label htmlFor="file-upload" className={styles.botao}>Adicionar Imagem</label>

              <input
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={handleImagem}
                style={{ display: 'none' }}
              />
            </div>


            <div className={styles.containerBotoes}>
              <button className={styles.botao}
                onClick={() => {
                  deleta()
                }}
              >
                Excluir Rascunho
              </button>
            </div>
          </div>


          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '300px', borderRadius: '8px' }}
              />
            </div>
          )}




        </div>
      </div>
    </div>

  </>
}

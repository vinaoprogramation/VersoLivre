import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css'

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";


import usePostagens from "../../Service/usePostagens";

export default function VisualizacaoPostagem() {
  const buscaRascunho = usePostagens((state) => state.buscaRascunho);
  const rascunho = usePostagens((state) => state.rascunho);

  const navigate = useNavigate();

  useEffect(() => {
    const busca = async() => {
      if(buscaRascunho){
        const busca = await buscaRascunho();
        if(busca){
          localStorage.setItem('id_mostra', rascunho.id_postagem)
        }
      }
    }

    busca()
  })

  const [dadosRascunho, setDadosRascunhos] = useState(null)

  useEffect(() => {
    if(rascunho){
      localStorage.setItem('rascunho', rascunho)
    }
  }, [])

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>
        
      </div>
    </div>

  </>
}
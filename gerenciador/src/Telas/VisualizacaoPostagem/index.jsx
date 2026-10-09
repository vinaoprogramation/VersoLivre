import React, { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.css'

import { ActivityIndicator } from "../../Reutilizaveis/ActivityIndicador";


import usePostagens from "../../Service/usePostagens";

export default function VisualizacaoPostagem() {
  const carregaRascunho = usePostagens((state) => state.carregaRascunho);
  const rascunho = usePostagens((state) => state.rascunho);
  const idRascunho = usePostagens((state) => state.idRascunho);

  const navigate = useNavigate();

  useEffect(() => {
    if(carregaRascunho){
      if(idRascunho && idRascunho != null && idRascunho != localStorage.getItem('id_visualizar')){
        carregaRascunho()
      } else{
        carregaRascunho(localStorage.getItem('id_visualizar'))
      }
    }
  }, [])

  useEffect(() => {
    if(idRascunho != null){
      localStorage.setItem('id_visualizar', idRascunho)
    }
  
  }, [idRascunho])

  

  return <>
    <div className={styles.fundo}>
      <div className={styles.entrada}>
        {
          rascunho && rascunho != null?
          <>
            <div>
              <h1>{rascunho.titulo_postagem}</h1>
            </div>
          </>
          :
          null
        }
      </div>
    </div>

  </>
}
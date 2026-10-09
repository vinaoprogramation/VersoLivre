import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.module.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';  

import Login from './Telas/Login';
import HomeScreen from './Telas/HomeScreen';
import DetailScreen from './Telas/DetailsScreen';
import AdicionarPostagem from './Telas/AdicionarPostagem'
import Cadastro from './Telas/Cadastro'
import AprovaPostagem from './Telas/AprovaPostagem'
import VisualizacaoPostagem from './Telas/VisualizacaoPostagem'
import Usuarios from './Telas/Usuarios';

function App() {

  return (
    <>

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/Cadastro" element={<Cadastro />} />

          <Route path="/HomeScreen" element={<HomeScreen />} />

          <Route path="/DetailScreen/:idPostagem" element={<DetailScreen />} />

          <Route path="/Adicionar/Postagem" element={<AdicionarPostagem />} />

          <Route path="/Rascunhos" element={<AprovaPostagem />} />

          <Route path="/Visualizacao" element={<VisualizacaoPostagem />} />

          <Route path="/Usuarios" element={<Usuarios />} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App

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


function App() {

  return (
    <>

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/HomeScreen" element={<HomeScreen />} />

          <Route path="/DetailScreen/:idPostagem" element={<DetailScreen />} />

          <Route path="/Adicionar/Postagem" element={<AdicionarPostagem />} />

        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App

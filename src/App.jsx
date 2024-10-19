import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Analysis from './pages/Analysis'
import Topics from './pages/Topics'
import Archive from './pages/Archive'
import About from './pages/About'
import TopicPage from './pages/TopicPage'
const App = () => {
  return (
    <div className='app'>
        <Navbar></Navbar>
        <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/archive' element={<Archive/>}></Route>
        <Route path='/topics' element={<Topics/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path="/topic/:topic" element={<TopicPage />} />
      </Routes>
      <Footer></Footer>
    </div>
  )
}

export default App

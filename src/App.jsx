import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './components/Home'
import About from './components/About'
import NoteState from './context/notes/NoteState'
import Login from './components/Login'
import Signup from './components/Signup'
function App() {
  return (
    <>
      <NoteState>
        <BrowserRouter>
          <NavBar />
          <div className='container'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </BrowserRouter>
      </NoteState>
    </>
  )
}

export default App

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EventDetail from './pages/EventDetail'
import MovieDetail from './pages/MovieDetail'
import BookingPage from './pages/BookingPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<EventDetail />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/event/:id" element={<MovieDetail />} />
          <Route path="/booking/:id" element={<BookingPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

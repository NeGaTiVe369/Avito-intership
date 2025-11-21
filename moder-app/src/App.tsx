import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ListPage from './pages/ListPage'
import AdDetailPage from './pages/AdDetailPage'
import StatsPage from './pages/StatsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/item/:id" element={<AdDetailPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

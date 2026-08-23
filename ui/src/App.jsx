import { useState } from 'react'
import Header from './components/Header.jsx'
import OrderPage from './pages/OrderPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './App.css'

export default function App() {
  const [page, setPage] = useState('order')

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={setPage} />
      {page === 'order' ? <OrderPage /> : <AdminPage />}
    </div>
  )
}

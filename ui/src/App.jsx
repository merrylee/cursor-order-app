import { useEffect, useState } from 'react'
import {
  createOrder,
  fetchMenus,
  fetchOrders,
  updateMenuStock,
  updateOrderStatus,
} from './api.js'
import { advanceOrderStatus } from './orders.js'
import Header from './components/Header.jsx'
import OrderPage from './pages/OrderPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './App.css'

export default function App() {
  const [page, setPage] = useState('order')
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [loadError, setLoadError] = useState('')
  const [loadingMenus, setLoadingMenus] = useState(true)

  async function loadMenus() {
    const nextMenus = await fetchMenus()
    setMenus(nextMenus)
  }

  async function loadOrders() {
    const nextOrders = await fetchOrders()
    setOrders(nextOrders)
  }

  useEffect(() => {
    let cancelled = false
    setLoadingMenus(true)
    fetchMenus()
      .then((nextMenus) => {
        if (!cancelled) {
          setMenus(nextMenus)
          setLoadError('')
        }
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message)
      })
      .finally(() => {
        if (!cancelled) setLoadingMenus(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (page !== 'admin') return undefined
    let cancelled = false
    Promise.all([loadMenus(), loadOrders()]).catch((error) => {
      if (!cancelled) setLoadError(error.message)
    })
    return () => {
      cancelled = true
    }
  }, [page])

  async function handlePlaceOrder(cart) {
    try {
      await createOrder(
        cart.map((line) => ({
          menuId: line.menuId,
          quantity: line.quantity,
          optionIds: line.options.map((option) => option.id),
        })),
      )
      await loadMenus()
      return { ok: true, message: '주문이 완료되었습니다.' }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  async function handleChangeStock(menuId, delta) {
    try {
      const updated = await updateMenuStock(menuId, delta)
      setMenus((current) =>
        current.map((menu) => (menu.id === updated.id ? updated : menu)),
      )
    } catch (error) {
      setLoadError(error.message)
    }
  }

  async function handleAdvanceOrder(orderId) {
    const current = orders.find((order) => order.id === orderId)
    if (!current) return
    try {
      const updated = await updateOrderStatus(
        orderId,
        advanceOrderStatus(current.status),
      )
      setOrders((list) =>
        list.map((order) => (order.id === updated.id ? updated : order)),
      )
    } catch (error) {
      setLoadError(error.message)
    }
  }

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={setPage} />
      {loadError ? <p className="app-banner">{loadError}</p> : null}
      {page === 'order' ? (
        <OrderPage
          menus={menus}
          loading={loadingMenus}
          onPlaceOrder={handlePlaceOrder}
        />
      ) : (
        <AdminPage
          menus={menus}
          orders={orders}
          onChangeStock={handleChangeStock}
          onAdvanceOrder={handleAdvanceOrder}
        />
      )}
    </div>
  )
}

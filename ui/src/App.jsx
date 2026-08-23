import { useState } from 'react'
import { MENUS } from './data/menus.js'
import { cartTotal } from './cart.js'
import { changeStock, decreaseStock, hasEnoughStock } from './stock.js'
import { ORDER_STATUS, advanceOrderStatus } from './orders.js'
import Header from './components/Header.jsx'
import OrderPage from './pages/OrderPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './App.css'

const SAMPLE_ORDERS = [
  {
    id: 'sample-1',
    createdAt: new Date(2026, 6, 31, 13, 0),
    items: [
      {
        key: 'americano-ice:',
        menuId: 'americano-ice',
        name: '아메리카노(ICE)',
        options: [],
        unitPrice: 4000,
        quantity: 1,
      },
    ],
    total: 4000,
    status: ORDER_STATUS.received,
  },
]

export default function App() {
  const [page, setPage] = useState('order')
  const [menus, setMenus] = useState(MENUS)
  const [orders, setOrders] = useState(SAMPLE_ORDERS)

  function handlePlaceOrder(cart) {
    if (!hasEnoughStock(menus, cart)) {
      return { ok: false, message: '재고가 부족하여 주문할 수 없습니다.' }
    }

    setMenus(decreaseStock(menus, cart))
    setOrders((current) => [
      {
        id: String(Date.now()),
        createdAt: new Date(),
        items: cart,
        total: cartTotal(cart),
        status: ORDER_STATUS.received,
      },
      ...current,
    ])
    return { ok: true, message: '주문이 완료되었습니다.' }
  }

  function handleChangeStock(menuId, delta) {
    setMenus((current) => changeStock(current, menuId, delta))
  }

  function handleAdvanceOrder(orderId) {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status: advanceOrderStatus(order.status) }
          : order,
      ),
    )
  }

  return (
    <div className="app">
      <Header currentPage={page} onNavigate={setPage} />
      {page === 'order' ? (
        <OrderPage menus={menus} onPlaceOrder={handlePlaceOrder} />
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

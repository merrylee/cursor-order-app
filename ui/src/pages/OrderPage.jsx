import { useState } from 'react'
import { addToCart } from '../cart.js'
import MenuCard from '../components/MenuCard.jsx'
import Cart from '../components/Cart.jsx'

export default function OrderPage({ menus, loading, onPlaceOrder }) {
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')
  const [ordering, setOrdering] = useState(false)

  function handleAdd(menu, selectedOptions) {
    setMessage('')
    setCart((current) => addToCart(current, menu, selectedOptions))
  }

  async function handleOrder() {
    setOrdering(true)
    const result = await onPlaceOrder(cart)
    setOrdering(false)
    if (result.ok) {
      setCart([])
    }
    setMessage(result.message)
  }

  return (
    <div className="order-page">
      <div className="menu-list">
        {loading ? (
          <p className="placeholder">메뉴를 불러오는 중입니다.</p>
        ) : menus.length === 0 ? (
          <p className="placeholder">표시할 메뉴가 없습니다.</p>
        ) : (
          <div className="menu-grid">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>
      <Cart
        items={cart}
        message={message}
        ordering={ordering}
        onOrder={handleOrder}
      />
    </div>
  )
}

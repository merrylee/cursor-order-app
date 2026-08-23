import { useState } from 'react'
import { addToCart } from '../cart.js'
import MenuCard from '../components/MenuCard.jsx'
import Cart from '../components/Cart.jsx'

export default function OrderPage({ menus, onPlaceOrder }) {
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')

  function handleAdd(menu, selectedOptions) {
    setMessage('')
    setCart((current) => addToCart(current, menu, selectedOptions))
  }

  function handleOrder() {
    const result = onPlaceOrder(cart)
    if (result.ok) {
      setCart([])
    }
    setMessage(result.message)
  }

  return (
    <div className="order-page">
      <div className="menu-list">
        {menus.length === 0 ? (
          <p className="placeholder">표시할 메뉴가 없습니다.</p>
        ) : (
          <div className="menu-grid">
            {menus.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>
      <Cart items={cart} message={message} onOrder={handleOrder} />
    </div>
  )
}

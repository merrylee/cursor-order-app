import { useState } from 'react'
import { MENUS } from '../data/menus.js'
import { addToCart } from '../cart.js'
import MenuCard from '../components/MenuCard.jsx'
import Cart from '../components/Cart.jsx'

export default function OrderPage() {
  const [cart, setCart] = useState([])
  const [message, setMessage] = useState('')

  function handleAdd(menu, selectedOptions) {
    setMessage('')
    setCart((current) => addToCart(current, menu, selectedOptions))
  }

  function handleOrder() {
    setCart([])
    setMessage('주문이 완료되었습니다.')
  }

  return (
    <div className="order-page">
      <div className="menu-list">
        {MENUS.length === 0 ? (
          <p className="placeholder">표시할 메뉴가 없습니다.</p>
        ) : (
          <div className="menu-grid">
            {MENUS.map((menu) => (
              <MenuCard key={menu.id} menu={menu} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>
      <Cart items={cart} message={message} onOrder={handleOrder} />
    </div>
  )
}

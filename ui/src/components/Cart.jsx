import {
  cartTotal,
  formatLineLabel,
  formatWon,
  lineTotal,
} from '../cart.js'

export default function Cart({
  items,
  message,
  onOrder,
}) {
  const empty = items.length === 0
  const total = cartTotal(items)

  return (
    <section className="cart" aria-label="장바구니">
      <div className="cart-body">
        <h2 className="cart-title">장바구니</h2>
        {empty ? (
          <p className="cart-empty">담긴 상품이 없습니다.</p>
        ) : (
          <ul className="cart-lines">
            {items.map((line) => (
              <li key={line.key} className="cart-line">
                <span>{formatLineLabel(line)}</span>
                <span>{formatWon(lineTotal(line))}</span>
              </li>
            ))}
          </ul>
        )}
        {message ? <p className="cart-message">{message}</p> : null}
      </div>
      <div className="cart-summary">
        <p className="cart-total">총 금액 {formatWon(total)}</p>
        <button
          type="button"
          className="btn-primary btn-order"
          disabled={empty}
          onClick={onOrder}
        >
          주문하기
        </button>
      </div>
    </section>
  )
}

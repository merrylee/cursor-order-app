import { formatWon } from '../cart.js'
import { stockStatus } from '../stock.js'
import {
  ORDER_STATUS_LABEL,
  canAdvanceOrder,
  countByStatus,
  formatOrderDate,
  formatOrderItems,
  statusActionLabel,
} from '../orders.js'

export default function AdminPage({ menus, orders, onChangeStock, onAdvanceOrder }) {
  const counts = countByStatus(orders)

  return (
    <main className="admin-page">
      <section className="admin-section">
        <h2 className="admin-title">관리자 대시보드</h2>
        <div className="dash-grid">
          <article className="dash-card">
            <h3 className="dash-label">총 주문</h3>
            <p className="dash-count">{counts.total}</p>
            <p className="dash-unit">건</p>
          </article>
          <article className="dash-card">
            <h3 className="dash-label">주문 접수</h3>
            <p className="dash-count">{counts.received}</p>
            <p className="dash-unit">건</p>
          </article>
          <article className="dash-card">
            <h3 className="dash-label">제조 중</h3>
            <p className="dash-count">{counts.preparing}</p>
            <p className="dash-unit">건</p>
          </article>
          <article className="dash-card">
            <h3 className="dash-label">제조 완료</h3>
            <p className="dash-count">{counts.done}</p>
            <p className="dash-unit">건</p>
          </article>
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-title">재고 현황</h2>
        <div className="stock-grid">
          {menus.map((menu) => {
            const status = stockStatus(menu.stock)
            return (
              <article key={menu.id} className="stock-card">
                <h3 className="stock-name">{menu.name}</h3>
                <p className="stock-count">{menu.stock}개</p>
                <p className={`stock-status stock-status-${status.kind}`}>
                  {status.label}
                </p>
                <div className="stock-actions">
                  <button
                    type="button"
                    className="btn-stock"
                    disabled={menu.stock <= 0}
                    onClick={() => onChangeStock(menu.id, -1)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="btn-stock"
                    onClick={() => onChangeStock(menu.id, 1)}
                  >
                    +
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="admin-section">
        <h2 className="admin-title">주문 현황</h2>
        {orders.length === 0 ? (
          <p className="placeholder">접수된 주문이 없습니다.</p>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="order-row">
                <div className="order-info">
                  <span>{formatOrderDate(order.createdAt)}</span>
                  <span>{formatOrderItems(order.items)}</span>
                  <span>{formatWon(order.total)}</span>
                  <span className="order-status-text">
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-primary btn-order-status"
                  disabled={!canAdvanceOrder(order.status)}
                  onClick={() => onAdvanceOrder(order.id)}
                >
                  {statusActionLabel(order.status)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

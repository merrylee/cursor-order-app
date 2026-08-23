import pool from './db.js'

export function mapOrder(row) {
  return {
    id: row.id,
    orderedAt: row.ordered_at.toISOString(),
    status: row.status,
    totalAmount: row.total_amount,
    items: row.items,
  }
}

export const NEXT_STATUS = {
  received: 'preparing',
  preparing: 'done',
}

export async function listOrders() {
  const result = await pool.query(`
    SELECT id, ordered_at, items, total_amount, status
    FROM orders
    ORDER BY ordered_at DESC, id DESC
  `)
  return result.rows.map(mapOrder)
}

export async function getOrderById(id) {
  const result = await pool.query(
    `
    SELECT id, ordered_at, items, total_amount, status
    FROM orders
    WHERE id = $1
    `,
    [id],
  )
  return result.rows[0] ? mapOrder(result.rows[0]) : null
}

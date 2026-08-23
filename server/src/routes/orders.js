import { Router } from 'express'
import pool from '../db.js'
import { sendError, parseId } from '../http.js'
import { getOrderById, listOrders, mapOrder, NEXT_STATUS } from '../orders.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const orders = await listOrders()
    res.json(orders)
  } catch (error) {
    sendError(res, 500, '주문 목록을 불러오지 못했습니다.')
  }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    sendError(res, 400, '잘못된 주문 ID입니다.')
    return
  }

  try {
    const order = await getOrderById(id)
    if (!order) {
      sendError(res, 404, '주문을 찾을 수 없습니다.')
      return
    }
    res.json(order)
  } catch (error) {
    sendError(res, 500, '주문을 불러오지 못했습니다.')
  }
})

router.post('/', async (req, res) => {
  const items = req.body?.items
  if (!Array.isArray(items) || items.length === 0) {
    sendError(res, 400, '주문 항목이 필요합니다.')
    return
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const needed = new Map()
    for (const item of items) {
      const menuId = Number(item.menuId)
      const quantity = Number(item.quantity)
      if (!Number.isInteger(menuId) || menuId <= 0) {
        throw Object.assign(new Error('잘못된 메뉴 ID입니다.'), { status: 400 })
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw Object.assign(new Error('수량은 1 이상이어야 합니다.'), { status: 400 })
      }
      needed.set(menuId, (needed.get(menuId) || 0) + quantity)
    }

    const menuIds = [...needed.keys()]
    const menuResult = await client.query(
      `SELECT id, name, price, stock FROM menus WHERE id = ANY($1::int[]) FOR UPDATE`,
      [menuIds],
    )
    if (menuResult.rows.length !== menuIds.length) {
      throw Object.assign(new Error('메뉴를 찾을 수 없습니다.'), { status: 400 })
    }

    const menus = new Map(menuResult.rows.map((row) => [row.id, row]))
    for (const [menuId, quantity] of needed) {
      if (menus.get(menuId).stock < quantity) {
        throw Object.assign(new Error('재고가 부족하여 주문할 수 없습니다.'), {
          status: 400,
        })
      }
    }

    const optionResult = await client.query(
      `SELECT id, name, price, menu_id FROM options WHERE menu_id = ANY($1::int[])`,
      [menuIds],
    )
    const optionsByMenu = new Map()
    for (const option of optionResult.rows) {
      const list = optionsByMenu.get(option.menu_id) || []
      list.push(option)
      optionsByMenu.set(option.menu_id, list)
    }

    const savedItems = []
    let totalAmount = 0

    for (const item of items) {
      const menu = menus.get(Number(item.menuId))
      const optionIds = Array.isArray(item.optionIds) ? item.optionIds : []
      const menuOptions = optionsByMenu.get(menu.id) || []
      const selected = []

      for (const optionId of optionIds) {
        const option = menuOptions.find((row) => row.id === Number(optionId))
        if (!option) {
          throw Object.assign(new Error('해당 메뉴에 없는 옵션입니다.'), {
            status: 400,
          })
        }
        selected.push({ id: option.id, name: option.name, price: option.price })
      }

      const extra = selected.reduce((sum, option) => sum + option.price, 0)
      const amount = (menu.price + extra) * Number(item.quantity)
      totalAmount += amount
      savedItems.push({
        menuId: menu.id,
        name: menu.name,
        quantity: Number(item.quantity),
        options: selected,
        amount,
      })
    }

    for (const [menuId, quantity] of needed) {
      await client.query(
        'UPDATE menus SET stock = stock - $1 WHERE id = $2',
        [quantity, menuId],
      )
    }

    const inserted = await client.query(
      `
      INSERT INTO orders (ordered_at, items, total_amount, status)
      VALUES (NOW(), $1::jsonb, $2, 'received')
      RETURNING id, ordered_at, items, total_amount, status
      `,
      [JSON.stringify(savedItems), totalAmount],
    )

    await client.query('COMMIT')
    res.status(201).json(mapOrder(inserted.rows[0]))
  } catch (error) {
    await client.query('ROLLBACK')
    sendError(res, error.status || 500, error.message || '주문을 저장하지 못했습니다.')
  } finally {
    client.release()
  }
})

router.patch('/:id/status', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    sendError(res, 400, '잘못된 주문 ID입니다.')
    return
  }

  const nextStatus = req.body?.status
  if (!nextStatus) {
    sendError(res, 400, '변경할 상태가 필요합니다.')
    return
  }

  try {
    const current = await getOrderById(id)
    if (!current) {
      sendError(res, 404, '주문을 찾을 수 없습니다.')
      return
    }

    const allowed = NEXT_STATUS[current.status]
    if (!allowed || nextStatus !== allowed) {
      sendError(res, 400, '이 상태로는 변경할 수 없습니다.')
      return
    }

    const updated = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING id, ordered_at, items, total_amount, status
      `,
      [nextStatus, id],
    )
    res.json(mapOrder(updated.rows[0]))
  } catch (error) {
    sendError(res, 500, '주문 상태를 변경하지 못했습니다.')
  }
})

export default router

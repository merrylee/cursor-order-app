import { Router } from 'express'
import pool from '../db.js'
import { sendError, parseId } from '../http.js'
import { getMenuById, listMenus } from '../menus.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const menus = await listMenus()
    res.json(menus)
  } catch (error) {
    sendError(res, 500, '메뉴를 불러오지 못했습니다.')
  }
})

router.patch('/:id/stock', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) {
    sendError(res, 400, '잘못된 메뉴 ID입니다.')
    return
  }

  const hasStock = Number.isInteger(req.body?.stock)
  const hasDelta = Number.isInteger(req.body?.delta)
  if (hasStock === hasDelta) {
    sendError(res, 400, 'stock 또는 delta 중 하나만 보내 주세요.')
    return
  }

  try {
    const menu = await getMenuById(id)
    if (!menu) {
      sendError(res, 404, '메뉴를 찾을 수 없습니다.')
      return
    }

    const nextStock = hasStock
      ? req.body.stock
      : menu.stock + req.body.delta

    if (nextStock < 0) {
      sendError(res, 400, '재고는 0 미만이 될 수 없습니다.')
      return
    }

    await pool.query('UPDATE menus SET stock = $1 WHERE id = $2', [nextStock, id])
    const updated = await getMenuById(id)
    res.json(updated)
  } catch (error) {
    sendError(res, 500, '재고를 수정하지 못했습니다.')
  }
})

export default router

export function stockStatus(count) {
  if (count <= 0) return { label: '품절', kind: 'soldout' }
  if (count < 5) return { label: '주의', kind: 'warning' }
  return { label: '정상', kind: 'ok' }
}

export function changeStock(menus, menuId, delta) {
  return menus.map((menu) => {
    if (menu.id !== menuId) return menu
    return { ...menu, stock: Math.max(0, menu.stock + delta) }
  })
}

function neededQuantities(cart) {
  return cart.reduce((needed, line) => {
    needed[line.menuId] = (needed[line.menuId] || 0) + line.quantity
    return needed
  }, {})
}

export function hasEnoughStock(menus, cart) {
  const needed = neededQuantities(cart)
  return Object.entries(needed).every(([menuId, quantity]) => {
    const menu = menus.find((item) => item.id === menuId)
    return Boolean(menu) && menu.stock >= quantity
  })
}

export function decreaseStock(menus, cart) {
  const needed = neededQuantities(cart)
  return menus.map((menu) => {
    const used = needed[menu.id]
    if (!used) return menu
    return { ...menu, stock: menu.stock - used }
  })
}

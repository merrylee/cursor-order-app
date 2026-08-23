async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || '요청에 실패했습니다.')
  }
  return data
}

export function mapMenu(menu) {
  return {
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: menu.price,
    image: menu.imageUrl,
    stock: menu.stock,
    options: menu.options ?? [],
  }
}

export function mapOrder(order) {
  return {
    id: order.id,
    createdAt: order.orderedAt,
    status: order.status,
    total: order.totalAmount,
    items: order.items ?? [],
  }
}

export async function fetchMenus() {
  const menus = await request('/api/menus')
  return menus.map(mapMenu)
}

export async function fetchOrders() {
  const orders = await request('/api/orders')
  return orders.map(mapOrder)
}

export async function createOrder(items) {
  const order = await request('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
  return mapOrder(order)
}

export async function updateOrderStatus(id, status) {
  const order = await request(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
  return mapOrder(order)
}

export async function updateMenuStock(id, delta) {
  const menu = await request(`/api/menus/${id}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ delta }),
  })
  return mapMenu(menu)
}

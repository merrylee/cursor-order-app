export const ORDER_STATUS = {
  received: 'received',
  preparing: 'preparing',
  done: 'done',
}

export const ORDER_STATUS_LABEL = {
  received: '주문 접수',
  preparing: '제조 중',
  done: '제조 완료',
}

export function formatOrderDate(date) {
  const value = date instanceof Date ? date : new Date(date)
  const hours = String(value.getHours()).padStart(2, '0')
  const minutes = String(value.getMinutes()).padStart(2, '0')
  return `${value.getMonth() + 1}월 ${value.getDate()}일 ${hours}:${minutes}`
}

export function formatOrderItems(items) {
  return items
    .map((line) => {
      const name =
        line.options.length > 0
          ? `${line.name} (${line.options.map((option) => option.name).join(', ')})`
          : line.name
      return `${name} x ${line.quantity}`
    })
    .join(', ')
}

export function countByStatus(orders) {
  const received = orders.filter((order) => order.status === ORDER_STATUS.received).length
  const preparing = orders.filter((order) => order.status === ORDER_STATUS.preparing).length
  const done = orders.filter((order) => order.status === ORDER_STATUS.done).length
  return {
    total: orders.length,
    received,
    preparing,
    done,
  }
}

export function statusActionLabel(status) {
  if (status === ORDER_STATUS.received) return '제조 시작'
  if (status === ORDER_STATUS.preparing) return '제조 완료'
  return '제조 완료'
}

export function advanceOrderStatus(status) {
  if (status === ORDER_STATUS.received) return ORDER_STATUS.preparing
  if (status === ORDER_STATUS.preparing) return ORDER_STATUS.done
  return status
}

export function canAdvanceOrder(status) {
  return status !== ORDER_STATUS.done
}

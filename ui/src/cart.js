export function formatWon(amount) {
  return `${amount.toLocaleString('ko-KR')}원`
}

function optionKey(options) {
  return options
    .map((option) => option.id)
    .sort()
    .join(',')
}

export function addToCart(cart, menu, selectedOptions) {
  const extra = selectedOptions.reduce((sum, option) => sum + option.price, 0)
  const key = `${menu.id}:${optionKey(selectedOptions)}`
  const existing = cart.find((line) => line.key === key)

  if (existing) {
    return cart.map((line) =>
      line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
    )
  }

  return [
    ...cart,
    {
      key,
      menuId: menu.id,
      name: menu.name,
      options: selectedOptions,
      unitPrice: menu.price + extra,
      quantity: 1,
    },
  ]
}

export function lineTotal(line) {
  return line.unitPrice * line.quantity
}

export function cartTotal(cart) {
  return cart.reduce((sum, line) => sum + lineTotal(line), 0)
}

export function formatLineLabel(line) {
  const quantity = `X ${line.quantity}`
  if (line.options.length === 0) {
    return `${line.name} ${quantity}`
  }
  const optionNames = line.options.map((option) => option.name).join(', ')
  return `${line.name} (${optionNames}) ${quantity}`
}

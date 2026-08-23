export function sendError(res, status, message) {
  res.status(status).json({ error: message })
}

export function parseId(value) {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) return null
  return id
}

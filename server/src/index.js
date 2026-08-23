import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb, pingDb } from './db.js'
import menusRouter from './routes/menus.js'
import ordersRouter from './routes/orders.js'

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  try {
    const now = await pingDb()
    res.json({ ok: true, db: 'connected', now })
  } catch (error) {
    res.status(503).json({ ok: false, db: 'disconnected' })
  }
})

app.use('/api/menus', menusRouter)
app.use('/api/orders', ordersRouter)

async function start() {
  await connectDb()
  console.log(`PostgreSQL connected (${process.env.PGHOST})`)

  app.listen(port, () => {
    console.log(`COZY server listening on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('Failed to start server:', error.message)
  process.exit(1)
})

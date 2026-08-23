import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  max: 10,
  connectionTimeoutMillis: 8000,
})

export async function connectDb() {
  await pool.query('SELECT 1')
}

export async function pingDb() {
  const result = await pool.query('SELECT NOW() AS now')
  return result.rows[0].now
}

export default pool

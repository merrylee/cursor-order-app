import pool from './db.js'

export function mapMenu(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    stock: row.stock,
    options: Array.isArray(row.options)
      ? row.options
      : JSON.parse(row.options || '[]'),
  }
}

export async function listMenus(client = pool) {
  const result = await client.query(`
    SELECT
      m.id,
      m.name,
      m.description,
      m.price,
      m.image_url,
      m.stock,
      COALESCE(
        json_agg(
          json_build_object('id', o.id, 'name', o.name, 'price', o.price)
          ORDER BY o.id
        ) FILTER (WHERE o.id IS NOT NULL),
        '[]'
      ) AS options
    FROM menus m
    LEFT JOIN options o ON o.menu_id = m.id
    GROUP BY m.id
    ORDER BY m.id
  `)
  return result.rows.map(mapMenu)
}

export async function getMenuById(id, client = pool) {
  const result = await client.query(
    `
    SELECT
      m.id,
      m.name,
      m.description,
      m.price,
      m.image_url,
      m.stock,
      COALESCE(
        json_agg(
          json_build_object('id', o.id, 'name', o.name, 'price', o.price)
          ORDER BY o.id
        ) FILTER (WHERE o.id IS NOT NULL),
        '[]'
      ) AS options
    FROM menus m
    LEFT JOIN options o ON o.menu_id = m.id
    WHERE m.id = $1
    GROUP BY m.id
    `,
    [id],
  )
  return result.rows[0] ? mapMenu(result.rows[0]) : null
}

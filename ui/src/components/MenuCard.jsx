import { useState } from 'react'
import { formatWon } from '../cart.js'

export default function MenuCard({ menu, onAdd }) {
  const [selectedIds, setSelectedIds] = useState([])

  function toggleOption(optionId) {
    setSelectedIds((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    )
  }

  function handleAdd() {
    const selectedOptions = menu.options.filter((option) =>
      selectedIds.includes(option.id),
    )
    onAdd(menu, selectedOptions)
    setSelectedIds([])
  }

  return (
    <article className="menu-card">
      {menu.image ? (
        <img className="menu-image" src={menu.image} alt={menu.name} />
      ) : (
        <div className="menu-image menu-image-empty" aria-hidden="true" />
      )}
      <h3 className="menu-name">{menu.name}</h3>
      <p className="menu-price">{formatWon(menu.price)}</p>
      <p className="menu-desc">{menu.description}</p>
      {menu.options.length > 0 ? (
        <ul className="menu-options">
          {menu.options.map((option) => (
            <li key={option.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(option.id)}
                  disabled={menu.stock <= 0}
                  onChange={() => toggleOption(option.id)}
                />
                {option.name} (+{formatWon(option.price)})
              </label>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className="btn-primary"
        disabled={menu.stock <= 0}
        onClick={handleAdd}
      >
        {menu.stock <= 0 ? '품절' : '담기'}
      </button>
    </article>
  )
}

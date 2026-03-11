import { useState, useEffect } from 'react'

const API_BASE = '/api'

function ItemsList() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch(`${API_BASE}/items`)
        const data = await res.json()
        setItems(data.items)
      } catch (err) {
        setError(`Failed to load items: ${err.message}`)
      }
    }
    loadItems()
  }, [])

  return (
    <section id="items-section">
      <h2>Items</h2>
      <ul id="items-list">
        {error && <li style={{ color: 'red' }}>{error}</li>}
        {!items && !error && <li>Loading…</li>}
        {items && items.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> – {item.description}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ItemsList

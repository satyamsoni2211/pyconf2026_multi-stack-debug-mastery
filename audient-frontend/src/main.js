/**
 * Audient Frontend – main entry point.
 *
 * Workshop: Multi-Stack Debug Mastery (PyConf 2026)
 *
 * This file is intentionally simple so you can focus on the debugging
 * workflow rather than the application logic.
 *
 * Open DevTools (F12) or attach the "Chrome: Debug Frontend" configuration
 * from launch.json to set breakpoints here.
 */

const API_BASE = '/api'

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

async function checkHealth() {
  const statusEl = document.getElementById('health-status')
  try {
    // ← Set a breakpoint here during Part 4 of the workshop!
    const res = await fetch(`${API_BASE}/health`)
    const data = await res.json()
    statusEl.textContent = `✅ Backend is ${data.status}`
    statusEl.style.color = 'green'
  } catch (err) {
    statusEl.textContent = `❌ Backend unreachable: ${err.message}`
    statusEl.style.color = 'red'
  }
}

// ---------------------------------------------------------------------------
// Items list
// ---------------------------------------------------------------------------

async function loadItems() {
  const listEl = document.getElementById('items-list')
  try {
    const res = await fetch(`${API_BASE}/items`)
    const data = await res.json()
    listEl.innerHTML = ''
    for (const item of data.items) {
      const li = document.createElement('li')
      li.innerHTML = `<strong>${item.name}</strong> – ${item.description}`
      listEl.appendChild(li)
    }
  } catch (err) {
    listEl.innerHTML = `<li style="color:red">Failed to load items: ${err.message}</li>`
  }
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  checkHealth()
  loadItems()
})

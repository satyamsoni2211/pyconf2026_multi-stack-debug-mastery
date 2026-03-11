import { useState, useEffect } from 'react'

const API_BASE = '/api'

function HealthCheck() {
  const [status, setStatus] = useState('Checking…')
  const [color, setColor] = useState('inherit')

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${API_BASE}/health`)
        const data = await res.json()
        setStatus(`✅ Backend is ${data.status}`)
        setColor('green')
      } catch (err) {
        setStatus(`❌ Backend unreachable: ${err.message}`)
        setColor('red')
      }
    }
    checkHealth()
  }, [])

  return (
    <section id="health-section">
      <h2>Backend Health</h2>
      <p id="health-status" style={{ color }}>{status}</p>
    </section>
  )
}

export default HealthCheck

import { useState } from 'react'

function Ej4() {
  const [celsius, setCelsius] = useState('')
  const temperatura = celsius.trim() === '' ? null : Number(celsius)
  const fahrenheit = temperatura === null ? null : (temperatura * 9) / 5 + 32

  return (
    <div className="card">
      <label htmlFor="celsius">Temperatura en Celsius (°C)</label>
      <input
        id="celsius"
        type="number"
        value={celsius}
        onChange={(event) => setCelsius(event.target.value)}
        placeholder="Por ejemplo, 35"
      />
      <p aria-live="polite">
        Fahrenheit:{' '}
        {fahrenheit === null ? '—' : `${Number(fahrenheit.toFixed(2))} °F`}
      </p>
      {temperatura !== null && temperatura > 30 && (
        <p className="warm-message">Hace calor</p>
      )}
    </div>
  )
}

export default Ej4

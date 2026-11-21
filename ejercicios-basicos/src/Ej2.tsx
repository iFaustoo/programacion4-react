import { useState } from 'react'

function Ej2() {
  const [valor, setValor] = useState(0)

  return (
    <div className="card counter-card">
      <p className="counter-value" aria-live="polite">
        {valor}
      </p>
      <div className="button-row">
        <button type="button" onClick={() => setValor((actual) => actual - 1)} disabled={valor === 0}>
          Restar
        </button>
        <button type="button" onClick={() => setValor((actual) => actual + 1)} disabled={valor === 10}>
          Sumar
        </button>
        <button type="button" className="button-secondary" onClick={() => setValor(0)}>
          Reiniciar
        </button>
      </div>
      <p className="helper-text">El contador va de 0 a 10.</p>
    </div>
  )
}

export default Ej2

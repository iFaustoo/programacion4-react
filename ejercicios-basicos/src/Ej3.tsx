import { useState } from 'react'

function Ej3() {
  const [visible, setVisible] = useState(false)

  return (
    <div className="card">
      <h3>¿Qué devuelve el método map?</h3>
      {visible && (
        <p className="answer" aria-live="polite">
          Devuelve un nuevo array con el resultado de aplicar una función a cada elemento.
        </p>
      )}
      <button type="button" onClick={() => setVisible((actual) => !actual)}>
        {visible ? 'Ocultar respuesta' : 'Mostrar respuesta'}
      </button>
    </div>
  )
}

export default Ej3

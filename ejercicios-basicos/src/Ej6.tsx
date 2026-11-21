import { useState } from 'react'

const lenguajes = [
  'Java',
  'JavaScript',
  'TypeScript',
  'Python',
  'C',
  'C++',
  'C#',
  'Ruby',
  'Go',
  'Rust',
]

function Ej6() {
  const [busqueda, setBusqueda] = useState('')
  const resultados = lenguajes.filter((lenguaje) =>
    lenguaje.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="card">
      <label htmlFor="busqueda-lenguaje">Buscar lenguaje</label>
      <input
        id="busqueda-lenguaje"
        type="search"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
        placeholder="Por ejemplo, ja"
      />
      <p className="result-count" aria-live="polite">
        {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
      </p>
      <ul className="language-list">
        {resultados.map((lenguaje) => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>
    </div>
  )
}

export default Ej6

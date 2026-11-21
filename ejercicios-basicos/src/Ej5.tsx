import { useRef, useState, type FormEvent } from 'react'

interface ItemCompra {
  id: number
  nombre: string
}

function Ej5() {
  const [nombre, setNombre] = useState('')
  const [items, setItems] = useState<ItemCompra[]>([])
  const siguienteId = useRef(0)

  function agregarItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nombreLimpio = nombre.trim()

    if (nombreLimpio === '') return

    setItems((actuales) => [
      ...actuales,
      { id: siguienteId.current++, nombre: nombreLimpio },
    ])
    setNombre('')
  }

  function eliminarItem(id: number) {
    setItems((actuales) => actuales.filter((item) => item.id !== id))
  }

  return (
    <div className="card">
      <form className="shopping-form" onSubmit={agregarItem}>
        <label htmlFor="nuevo-item">Producto para comprar</label>
        <div className="input-row">
          <input
            id="nuevo-item"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Por ejemplo, leche"
          />
          <button type="submit" disabled={nombre.trim() === ''}>
            Agregar
          </button>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="helper-text">No hay nada para comprar</p>
      ) : (
        <ul className="shopping-list">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.nombre}</span>
              <button
                type="button"
                className="button-secondary"
                onClick={() => eliminarItem(item.id)}
                aria-label={`Eliminar ${item.nombre}`}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Ej5

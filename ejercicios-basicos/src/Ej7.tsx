interface ProductoProps {
  nombre: string
  precio: number
  stock: number
  oferta?: boolean
}

function Producto({ nombre, precio, stock, oferta = false }: ProductoProps) {
  return (
    <article className="card product-card">
      <h3>{nombre}</h3>
      {oferta && <p className="offer-badge">¡Oferta!</p>}
      <p>Precio: ${precio}</p>
      <p>{stock === 0 ? 'Sin stock' : `Stock: ${stock}`}</p>
    </article>
  )
}

function Ej7() {
  return (
    <div className="card-grid">
      <Producto nombre="Teclado mecánico" precio={45000} stock={8} oferta />
      <Producto nombre="Mouse inalámbrico" precio={18000} stock={0} />
    </div>
  )
}

export default Ej7

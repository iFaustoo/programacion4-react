interface ProductoProps {
  nombre: string
  precio: number
  stock: number
}

function Producto({ nombre, precio, stock }: ProductoProps) {
  return (
    <article className="card product-card">
      <h3>{nombre}</h3>
      <p>Precio: ${precio}</p>
      <p>{stock === 0 ? 'Sin stock' : `Stock: ${stock}`}</p>
    </article>
  )
}

function Ej1() {
  const productos = [
    { nombre: 'Teclado mecánico', precio: 45000, stock: 8 },
    { nombre: 'Mouse inalámbrico', precio: 18000, stock: 0 },
    { nombre: 'Auriculares', precio: 32000, stock: 5 },
  ]

  return (
    <div className="card-grid">
      {productos.map((producto) => (
        <Producto key={producto.nombre} {...producto} />
      ))}
    </div>
  )
}

export default Ej1

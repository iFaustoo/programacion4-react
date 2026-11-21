import Ej1 from './Ej1'
import Ej2 from './Ej2'
import Ej3 from './Ej3'
import Ej4 from './Ej4'
import Ej5 from './Ej5'
import Ej6 from './Ej6'
import Ej7 from './Ej7'
import './App.css'

const ejercicios = [
  { titulo: 'Ejercicio 1: Tarjetas de producto (Props)', Componente: Ej1 },
  { titulo: 'Ejercicio 2: Contador con límites (useState)', Componente: Ej2 },
  { titulo: 'Ejercicio 3: Mostrar y ocultar (Condicionales)', Componente: Ej3 },
  { titulo: 'Ejercicio 4: Conversor de temperatura (Inputs controlados)', Componente: Ej4 },
  { titulo: 'Ejercicio 5: Lista de compras (Listas y estado)', Componente: Ej5 },
  { titulo: 'Ejercicio 6: Buscador (Filtrado)', Componente: Ej6 },
  { titulo: 'Ejercicio 7: Tipado con TypeScript', Componente: Ej7 },
]

function App() {
  return (
    <main className="app">
      <header className="page-header">
        <p className="eyebrow">React desde cero</p>
        <h1>Ejercicios básicos</h1>
        <p>Práctica de componentes, props, estado, listas y TypeScript.</p>
      </header>

      <div className="exercise-list">
        {ejercicios.map(({ titulo, Componente }) => (
          <section className="exercise-section" key={titulo}>
            <h2>{titulo}</h2>
            <Componente />
          </section>
        ))}
      </div>
    </main>
  )
}

export default App

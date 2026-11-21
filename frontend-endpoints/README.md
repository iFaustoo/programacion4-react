# Frontend de endpoints

Cada `practicaN/` es un proyecto Vite + React + TypeScript independiente y acumulativo.
Las prácticas se pueden abrir e instalar por separado; no hay una carpeta para la práctica 9.
La guía usada como referencia está en el repositorio público
[utn-tup-2026-frontend](https://github.com/marianoggg/utn-tup-2026-frontend).

| Carpeta | Contenido acumulado |
| --- | --- |
| `practica1/` | Login, formulario controlado, POST `/login` y manejo del resultado. |
| `practica2/` | Listado de usuarios y obtención de los datos del usuario autenticado. |
| `practica3/` | Persistencia del token en `localStorage` y cierre de sesión. |
| `practica4/` | Cliente HTTP común, errores tipados y funciones por endpoint. |
| `practica5/` | `AuthContext`, sesión global, React Router y rutas autenticadas. |
| `practica6/` | Búsqueda, filtro de mayores y paginación. |
| `practica7/` | Detalle, alta, edición y baja de usuarios. |
| `practica8/` | Permisos, roles, asignaciones y administración de permisos. |

Para cada carpeta:

1. Copiá `.env.example` como `.env.development` y completá `VITE_API_URL`.
2. Ejecutá `npm install` y `npm run dev`.
3. Abrí `http://localhost:5174` con la API disponible en `http://localhost:8000`.

No se versionan `node_modules`, archivos `.env` ni secretos. La consigna reflexiva de la
práctica 9 se responde en el cuestionario, no en una carpeta del repositorio.

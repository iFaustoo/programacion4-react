# Práctica 8 — Roles y permisos

Proyecto completo acumulado de las prácticas 1 a 8. Incluye login, sesión persistente,
listado, búsqueda y paginación de usuarios, ABM, control de permisos, roles y gestión
de permisos.

## Requisitos

- Node.js 20.19+ o 22.12+
- La API FastAPI de la cursada activa en `http://localhost:8000`

## Configuración

Copiá `.env.example` como `.env.development` y completá `VITE_API_URL` con la URL de
la API. El archivo `.env.development` no se versiona.

## Ejecución

```bash
npm install
npm run dev
```

Abrí `http://localhost:5174`. El puerto es fijo para coincidir con el CORS configurado
en el backend.

## Validación

```bash
npm run build
npm run lint
```

El backend decide realmente los permisos; ocultar acciones en el frontend solo mejora
la interfaz y no reemplaza la autorización del servidor.

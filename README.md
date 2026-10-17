# POS API

API REST para el sistema POS, construida con Node.js, Express y MySQL.

## Requisitos

- Node.js y npm
- MySQL con la base de datos `posdb` y las tablas del proyecto

## Configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env` y configura las credenciales locales de MySQL. Cambia `JWT_SECRET` por una clave aleatoria privada. No publiques `.env`.

3. Inicia la API:

   ```bash
   npm run dev
   ```

La API queda disponible en `http://localhost:3000` (o el puerto definido en `PORT`).

## Autenticación

El inicio de sesión es público:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "usuario": "nombre-de-usuario",
  "password": "contraseña"
}
```

Las demás rutas bajo `/api` requieren el token devuelto por el login:

```http
Authorization: Bearer <token>
```

## Recursos

- `/api/clientes`
- `/api/sucursales`
- `/api/categorias`
- `/api/usuarios`
- `/api/productos`
- `/api/ventas`
- `/api/detalles-ventas`

La ruta raíz `GET /` sirve como comprobación básica de que la API responde.

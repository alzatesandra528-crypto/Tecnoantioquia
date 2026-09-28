# Tecnoantioquia

Empresa de venta de accesorios, mantenimiento de celulares y equipos de cómputo.

## Estructura

- `frontend/`: sitio público y panel de inventario
- `backend/`: API Node.js + Express + MySQL

## Cómo ejecutarlo

1. Entra a `backend/`
2. Copia `.env.example` a `.env` y completa los datos de MySQL
3. Instala dependencias: `npm install`
4. Arranca el servidor: `npm start`
5. Abre http://localhost:3000

## Usuarios iniciales

- Administrador: `admin` / `admin123` (único que puede crear, editar y eliminar productos)
- Vendedor: `vendedor` / `vendedor123` (consulta inventario y registra ventas)

El pool de MySQL usa 1 conexión para respetar el límite del addon en Clever Cloud.

## Despliegue en Vercel

Sitio: https://tecnoantioquia.vercel.app

En el proyecto de Vercel agrega estas variables de entorno y vuelve a desplegar:

- `MYSQL_ADDON_HOST`
- `MYSQL_ADDON_DB`
- `MYSQL_ADDON_USER`
- `MYSQL_ADDON_PORT`
- `MYSQL_ADDON_PASSWORD`
- `JWT_SECRET`

Vercel sirve el `frontend/` como sitio estático y la API en `/api`.

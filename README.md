# Tecnoantioquia

Tienda PWA (Vite + React) y API con MongoDB.

## Carpetas

- `frontend/`: tienda, PWA y función `/api` de Vercel
- `backend/`: Express + MongoDB

## Local

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

- Tienda: http://localhost:5173
- API: http://localhost:4000

Usuarios: `admin` / `admin123` y `vendedor` / `vendedor123`

## Cómo agregar productos (administradora)

1. Entra a https://tecnoantioquia.vercel.app/login
2. Usuario `admin` y contraseña `admin123`
3. Pulsa **Nuevo producto**
4. Completa nombre, SKU, **precio de compra**, **precio de venta** y stock
5. La **ganancia** se calcula sola (venta − compra)
6. Activa “Visible en la tienda” y guarda

## Vercel

Mismo dominio: https://tecnoantioquia.vercel.app

En el proyecto (repo https://github.com/alzatesandra528-crypto/Tecnoantioquia ):

- **Root Directory:** `frontend`
- Apaga Override de Install, Build y Output
- Variables: `MONGODB_URI` y `JWT_SECRET`

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

1. https://vercel.com → proyecto **tecnoantioquia** → **Settings** → **Environment Variables**
2. Agrega (Production, Preview y Development):
   - `MONGODB_URI` = la cadena de Atlas (la misma de `backend/.env`)
   - `JWT_SECRET` = una clave secreta, por ejemplo `tecnoantioquia-secreto`
3. **Root Directory:** `frontend`
4. En [MongoDB Atlas](https://cloud.mongodb.com) → Network Access → permite `0.0.0.0/0`
5. **Deployments** → Redeploy del último despliegue

Vercel no usa `backend/.env`; esas variables hay que pegarlas en el panel.

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

## Vercel

Mismo dominio: https://tecnoantioquia.vercel.app

En el proyecto (repo https://github.com/alzatesandra528-crypto/Tecnoantioquia ):

- **Root Directory:** `frontend`
- Apaga Override de Install, Build y Output
- Variables: `MONGODB_URI` y `JWT_SECRET`

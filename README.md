# Tecnoantioquia

Sitio y catálogo: React + Vite + Material UI + Tailwind + PWA, API con MongoDB.

## Carpetas

- `frontend/`: tienda, panel y función `/api` de Vercel
- `backend/`: API local (Express + MongoDB)

## Cómo ejecutarlo

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run dev
```

- Tienda: http://localhost:5173
- API: http://localhost:4000

## Usuarios

- Administrador: `admin` / `admin123`
- Vendedor: `vendedor` / `vendedor123`

## Vercel

Usa el mismo dominio: https://tecnoantioquia.vercel.app

En el proyecto de Vercel:

- **Root Directory:** `frontend`
- Desactiva **Override** en Install, Build y Output
- Output Directory: `dist`
- Variables: `MONGODB_URI` y `JWT_SECRET`

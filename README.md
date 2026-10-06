# Tecnoantioquia

Tienda PWA (Vite + React) y API con MongoDB.

## Carpetas

- `frontend/`: React, Vite, PWA y diseño de Figma
- `backend/`: Express + MongoDB
- `api/`: función de Vercel (las peticiones `/api` del sitio)

No hay `public/` ni `scripts/` en la raíz. El `frontend/public/` es de Vite (favicon).

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

En el proyecto conectado a https://github.com/alzatesandra528-crypto/Tecnoantioquia :

- Root Directory: vacío (raíz del repo) **o** `frontend`
- Apaga Override de Install / Build / Output
- Variables: `MONGODB_URI` y `JWT_SECRET`

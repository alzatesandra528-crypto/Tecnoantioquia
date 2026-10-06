# Tecnoantioquia

Sitio y catálogo rediseñados con la identidad de Figma: React + Vite + Material UI + Tailwind + PWA, y MongoDB.

## Carpetas

- `frontend/`: tienda y panel (React, Vite, Material UI, Tailwind, PWA)
- `backend/`: API (Express + MongoDB)
- `api/`: función de Vercel que conecta la API al mismo dominio

## Cómo ejecutarlo

1. Instala [MongoDB Community](https://www.mongodb.com/try/download/community) o usa Atlas.
2. En `backend/.env` deja `MONGODB_URI` apuntando a tu cluster.
3. En la raíz:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run dev
```

- Tienda: http://localhost:5173
- API: http://localhost:4000

## Usuarios

- Administrador: `admin` / `admin123` (único que edita productos)
- Vendedor: `vendedor` / `vendedor123` (consulta y registra ventas)

En Vercel el **Root Directory** está en `frontend`. Puedes dejarlo así.

Si el Install Command está **Override**, cámbialo a:

`node scripts/vercel-install.cjs`

o desactiva el override para que use `vercel.json`.


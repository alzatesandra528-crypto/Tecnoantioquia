# Tecnoantioquia

Sitio y catálogo rediseñados con la identidad de Figma: React + Vite + Material UI + Tailwind + PWA, y MongoDB.

## Cómo ejecutarlo

1. Instala [MongoDB Community](https://www.mongodb.com/try/download/community) o usa Atlas.
2. En `server/.env` deja `MONGODB_URI` apuntando a tu cluster o a `mongodb://127.0.0.1:27017/tecnoantioquia`.
3. En la raíz:

```bash
npm install
npm install --prefix server
npm install --prefix client
npm run dev
```

- Tienda: http://localhost:5173
- API: http://localhost:4000

## Usuarios

- Administrador: `admin` / `admin123` (único que edita productos)
- Vendedor: `vendedor` / `vendedor123` (consulta y registra ventas)

const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..");
const publicDir = path.join(frontendDir, "public");
const backendSrc = path.join(frontendDir, "..", "backend", "src");
const libDest = path.join(frontendDir, "api", "_lib");

fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

const staticItems = [
  "index.html",
  "login.html",
  "inventario.html",
  "css",
  "js",
  "img"
];

for (const item of staticItems) {
  const from = path.join(frontendDir, item);
  const to = path.join(publicDir, item);
  if (fs.existsSync(from)) {
    fs.cpSync(from, to, { recursive: true });
  }
}

if (fs.existsSync(backendSrc)) {
  fs.rmSync(libDest, { recursive: true, force: true });
  fs.cpSync(backendSrc, libDest, { recursive: true });
  console.log("API lista para Vercel");
} else {
  console.log("backend/src no está en el clon; se omite la copia");
}

console.log("Carpeta public generada");

const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..");
const publicDir = path.join(frontendDir, "public");

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

console.log("Carpeta public generada");

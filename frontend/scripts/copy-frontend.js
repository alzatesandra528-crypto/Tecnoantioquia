const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "..");
const backendSrc = path.join(frontendDir, "..", "backend", "src");
const libDest = path.join(frontendDir, "api", "_lib");

if (fs.existsSync(backendSrc)) {
  fs.rmSync(libDest, { recursive: true, force: true });
  fs.cpSync(backendSrc, libDest, { recursive: true });
  console.log("API lista para Vercel");
} else {
  console.log("backend/src no está en el clon; se omite la copia");
}

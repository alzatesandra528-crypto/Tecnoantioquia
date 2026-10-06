import { execSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const backend = join(root, "..", "backend");
if (existsSync(join(backend, "package.json"))) {
  execSync("npm install", { cwd: backend, stdio: "inherit" });
}
execSync("npx vite build", { cwd: root, stdio: "inherit" });
const dist = join(root, "dist");
if (!existsSync(dist)) {
  throw new Error("No se generó dist");
}
cpSync(dist, join(root, "public"), { recursive: true });
console.log("Build de Vercel listo");

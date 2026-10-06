import { execSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
execSync("npx vite build", { cwd: root, stdio: "inherit" });
const dist = join(root, "dist");
if (!existsSync(dist)) {
  throw new Error("No se generó dist");
}
cpSync(dist, join(root, "public"), { recursive: true });
console.log("Build de Vercel listo");

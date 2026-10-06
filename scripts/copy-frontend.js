import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = existsSync(join(repo, "frontend", "package.json"))
  ? join(repo, "frontend")
  : repo;

execSync("npm run build", { cwd: frontend, stdio: "inherit" });

const dist = join(frontend, "dist");
if (!existsSync(dist)) {
  throw new Error("No se generó frontend/dist");
}

mkdirSync(join(repo, "public"), { recursive: true });
cpSync(dist, join(repo, "public"), { recursive: true });

console.log("Build de Vercel listo");

const { execSync } = require("child_process");
const { existsSync } = require("fs");
const { join } = require("path");

function install(dir) {
  execSync("npm install", {
    cwd: dir,
    stdio: "inherit",
    env: process.env
  });
}

const cwd = process.cwd();

if (existsSync(join(cwd, "frontend", "package.json"))) {
  install(join(cwd, "frontend"));
  install(join(cwd, "backend"));
  install(cwd);
} else {
  install(cwd);
  const backend = join(cwd, "..", "backend");
  if (existsSync(join(backend, "package.json"))) {
    install(backend);
  }
}

require("dotenv").config();

const { createApp } = require("./app");
const { initDatabase } = require("./initDb");

const app = createApp();
const port = Number(process.env.PORT || 3000);

if (!process.env.VERCEL) {
  initDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`TECNOANTIOQUIA listo en http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("No se pudo iniciar el servidor:", error);
      process.exit(1);
    });
}

module.exports = app;

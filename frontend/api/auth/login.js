const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../_lib/db");
const { send, readBody } = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return send(res, 405, { error: "Método no permitido." });
  }

  const body = readBody(req);
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!username || !password) {
    return send(res, 400, { error: "Usuario y contraseña son obligatorios." });
  }

  if (!process.env.JWT_SECRET) {
    return send(res, 500, { error: "Falta JWT_SECRET en las variables de Vercel." });
  }

  try {
    const rows = await query(
      "SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1",
      [username]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return send(res, 401, { error: "Credenciales incorrectas." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return send(res, 200, {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return send(res, 500, { error: "No se pudo iniciar sesión. Revisa la conexión a MySQL." });
  }
};

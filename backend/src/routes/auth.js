const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios." });
  }

  try {
    const rows = await query(
      "SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "No se pudo iniciar sesión." });
  }
});

module.exports = router;

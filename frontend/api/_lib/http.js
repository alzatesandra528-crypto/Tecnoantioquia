const jwt = require("jsonwebtoken");

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(data === undefined ? "" : JSON.stringify(data));
}

function readBody(req) {
  if (req.body == null || req.body === "") {
    return {};
  }
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function getUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return { error: "Debes iniciar sesión.", status: 401 };
  }

  try {
    return { user: jwt.verify(token, process.env.JWT_SECRET) };
  } catch {
    return { error: "Sesión inválida o vencida.", status: 401 };
  }
}

function requireAdmin(user) {
  if (!user || user.role !== "admin") {
    return { error: "Solo el administrador puede modificar el inventario.", status: 403 };
  }
  return null;
}

module.exports = { send, readBody, getUser, requireAdmin };

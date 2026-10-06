import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Debes iniciar sesión." });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Sesión inválida o vencida." });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Solo la administradora puede hacer esta acción." });
  }
  return next();
}

export function staffOnly(req, res, next) {
  if (req.user?.role !== "admin" && req.user?.role !== "vendedor") {
    return res.status(403).json({ error: "No tienes permiso para esta acción." });
  }
  return next();
}

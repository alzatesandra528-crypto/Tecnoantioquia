const bcrypt = require("bcryptjs");
const { query } = require("./db");

async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'vendedor') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      sku VARCHAR(50) NOT NULL UNIQUE,
      categoria VARCHAR(80) NOT NULL,
      precio DECIMAL(12,2) NOT NULL,
      stock INT NOT NULL DEFAULT 0,
      descripcion TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      cantidad INT NOT NULL,
      precio_unitario DECIMAL(12,2) NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_sales_product FOREIGN KEY (product_id) REFERENCES products(id),
      CONSTRAINT fk_sales_user FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  const users = await query("SELECT COUNT(*) AS total FROM users");
  if (Number(users[0].total) === 0) {
    const adminHash = await bcrypt.hash("admin123", 10);
    const sellerHash = await bcrypt.hash("vendedor123", 10);

    await query(
      "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?), (?, ?, ?)",
      ["admin", adminHash, "admin", "vendedor", sellerHash, "vendedor"]
    );
  }

  const products = await query("SELECT COUNT(*) AS total FROM products");
  if (Number(products[0].total) === 0) {
    await query(
      `INSERT INTO products (nombre, sku, categoria, precio, stock, descripcion) VALUES
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?)`,
      [
        "iPhone 13 reacondicionado",
        "CEL-IPH13",
        "Celulares",
        1850000,
        4,
        "Equipo revisado con garantía de 30 días.",
        "Audífonos inalámbricos",
        "ACC-AUD01",
        "Accesorios",
        45000,
        18,
        "Compatibles con Android e iOS.",
        "Cargador USB-C 20W",
        "ACC-CAR20",
        "Accesorios",
        28000,
        25,
        "Carga rápida para celulares.",
        "Cambio de display genérico",
        "SRV-DISP",
        "Servicio técnico",
        120000,
        10,
        "Repuesto disponible para modelos comunes."
      ]
    );
  }
}

module.exports = { initDatabase };

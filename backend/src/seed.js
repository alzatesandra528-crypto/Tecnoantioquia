import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";

export async function seedIfEmpty() {
  const users = await User.countDocuments();
  if (users === 0) {
    await User.insertMany([
      {
        username: "admin",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "admin"
      },
      {
        username: "vendedor",
        passwordHash: await bcrypt.hash("vendedor123", 10),
        role: "vendedor"
      }
    ]);
  }

  const products = await Product.countDocuments();
  if (products === 0) {
    await Product.insertMany([
      {
        name: "Samsung Galaxy A55 5G",
        sku: "CEL-001",
        category: "Celulares",
        description:
          "Galaxy A55 5G con 128 GB. Pantalla Super AMOLED de 6,6 pulgadas y batería de 5.000 mAh.",
        price: 1499000,
        stock: 8,
        images: ["/products/servicio-1.jpg"],
        published: true,
        variants: [
          { color: "Azul oscuro", capacity: "128 GB", price: 1499000, stock: 8 },
          { color: "Lila", capacity: "128 GB", price: 1499000, stock: 0 }
        ]
      },
      {
        name: "Audífonos inalámbricos",
        sku: "ACC-AUD01",
        category: "Accesorios",
        description: "Compatibles con Android e iOS.",
        price: 45000,
        stock: 18,
        images: ["/products/servicio-2.jpg"],
        published: true,
        variants: []
      },
      {
        name: "Cargador USB-C 20W",
        sku: "ACC-CAR20",
        category: "Accesorios",
        description: "Carga rápida para celulares.",
        price: 28000,
        stock: 25,
        images: ["/products/servicio-3.jpg"],
        published: true,
        variants: []
      }
    ]);
  }
}

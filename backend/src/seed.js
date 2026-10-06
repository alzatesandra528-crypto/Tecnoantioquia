import bcrypt from "bcryptjs";
import { User } from "./models/User.js";
import { Product } from "./models/Product.js";
import { Site } from "./models/Site.js";
import { defaultSite } from "./siteDefaults.js";

const catalog = [
  {
    name: "iPhone 16 Pro",
    sku: "CEL-IPH16P",
    category: "Celulares",
    subtitle: "128 GB · Titanio desierto",
    description:
      "iPhone de última generación con chip A18 Pro, cámara de 48 MP y diseño en titanio. Consulta colores y capacidades disponibles.",
    price: 5899000,
    cost: 5100000,
    stock: 5,
    images: [],
    published: true,
    specs: {
      Pantalla: "6,3 pulgadas · Super Retina XDR",
      Chip: "A18 Pro",
      Memoria: "128 GB",
      "Cámara principal": "48 MP",
      Batería: "Carga USB-C"
    },
    variants: [
      { color: "Titanio desierto", capacity: "128 GB", price: 5899000, stock: 3 },
      { color: "Titanio negro", capacity: "256 GB", price: 6599000, stock: 2 }
    ]
  },
  {
    name: "Samsung Galaxy S25 Ultra",
    sku: "CEL-S25U",
    category: "Celulares",
    subtitle: "256 GB · Titanio gris",
    description:
      "El Galaxy Ultra de última generación: pantalla grande, cámara de alta resolución y S Pen. Gama alta Samsung para trabajo y foto.",
    price: 5499000,
    cost: 4700000,
    stock: 6,
    images: [],
    published: true,
    specs: {
      Pantalla: "6,9 pulgadas · Dynamic AMOLED",
      Memoria: "256 GB",
      "Cámara principal": "200 MP",
      Batería: "5.000 mAh",
      Conectividad: "5G · USB-C"
    },
    variants: [
      { color: "Titanio gris", capacity: "256 GB", price: 5499000, stock: 4 },
      { color: "Titanio negro", capacity: "512 GB", price: 6299000, stock: 2 }
    ]
  },
  {
    name: "Xiaomi Redmi Note 14 Pro+",
    sku: "CEL-RN14P",
    category: "Celulares",
    subtitle: "256 GB · Negro",
    description:
      "Redmi de última generación: AMOLED, 5G y cámara de alta resolución. Gama alta accesible para el día a día.",
    price: 1899000,
    cost: 1480000,
    stock: 10,
    images: [],
    published: true,
    specs: {
      Pantalla: "6,67 pulgadas · AMOLED 120 Hz",
      Memoria: "256 GB",
      "Cámara principal": "200 MP",
      Batería: "5.110 mAh",
      Conectividad: "5G · USB-C"
    },
    variants: [
      { color: "Negro", capacity: "256 GB", price: 1899000, stock: 6 },
      { color: "Lavanda", capacity: "256 GB", price: 1899000, stock: 4 }
    ]
  },
  {
    name: "Samsung Galaxy A55 5G",
    sku: "CEL-001",
    category: "Celulares",
    subtitle: "128 GB · Azul oscuro",
    description:
      "Una pantalla fluida y espacio para lo que importa. Consulta este equipo con nuestro asesor. Galaxy A55 5G con 128 GB de almacenamiento, pantalla Super AMOLED de 6,6 pulgadas, cámara principal de 50 MP y batería de 5.000 mAh.",
    price: 1499000,
    stock: 8,
    images: [],
    published: true,
    specs: {
      Pantalla: "6,6 pulgadas · Super AMOLED",
      Memoria: "128 GB",
      "Cámara principal": "50 MP",
      Batería: "5.000 mAh",
      Conectividad: "5G · USB-C"
    },
    variants: [
      { color: "Azul oscuro", capacity: "128 GB", price: 1499000, stock: 8 },
      { color: "Lila", capacity: "128 GB", price: 1499000, stock: 0 }
    ]
  },
  {
    name: "Audífonos TWS Air",
    sku: "AUD-001",
    category: "Audio",
    subtitle: "Blanco",
    description: "Audio inalámbrico para acompañar tu día.",
    price: 129000,
    stock: 12,
    images: [],
    published: true,
    variants: [{ color: "Blanco", capacity: "", price: 129000, stock: 12 }]
  },
  {
    name: "Cargador USB-C 25 W",
    sku: "ACC-025",
    category: "Accesorios",
    subtitle: "Blanco · USB-C",
    description: "Carga rápida para celulares con USB-C.",
    price: 79000,
    stock: 20,
    images: [],
    published: true,
    variants: [{ color: "Blanco", capacity: "USB-C", price: 79000, stock: 20 }]
  },
  {
    name: "Parlante Mini Beat",
    sku: "AUD-002",
    category: "Audio",
    subtitle: "Negro",
    description: "Parlante compacto para llevar tu música.",
    price: 189000,
    stock: 9,
    images: [],
    published: true,
    variants: [{ color: "Negro", capacity: "", price: 189000, stock: 9 }]
  },
  {
    name: "Cable USB-C 1 m",
    sku: "ACC-CAB01",
    category: "Accesorios",
    subtitle: "Negro · 1 metro",
    description: "Cable de carga y datos USB-C de 1 metro.",
    price: 29000,
    stock: 30,
    images: [],
    published: true,
    variants: [{ color: "Negro", capacity: "1 metro", price: 29000, stock: 30 }]
  },
  {
    name: "Reloj inteligente Active",
    sku: "REL-001",
    category: "Relojes",
    subtitle: "Negro · Correa silicona",
    description: "Consulta disponibilidad de este reloj inteligente.",
    price: 219000,
    stock: 0,
    images: [],
    published: true,
    variants: [{ color: "Negro", capacity: "Correa silicona", price: 219000, stock: 0 }]
  }
];

export const demoCatalog = catalog;

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

  for (const item of catalog) {
    await Product.findOneAndUpdate(
      { sku: item.sku },
      { ...item, cost: item.cost ?? Math.round(item.price * 0.72) },
      { upsert: true, returnDocument: "after" }
    );
  }

  const site = await Site.findOne({ key: "landing" });
  if (!site) {
    await Site.create({ key: "landing", data: defaultSite });
  }
}

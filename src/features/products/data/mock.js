/**
 * Local mock data for the Products feature.
 * Swap this folder for a real API/data layer later.
 */

export const PRODUCTS = [
  {
    id: 101,
    name: 'Aurora Laptop 14"',
    category: "Electronics",
    price: 1299.0,
    stock: 24,
    status: "in_stock",
    icon: "laptop",
  },
  {
    id: 102,
    name: "Pulse Wireless Headphones",
    category: "Audio",
    price: 189.0,
    stock: 6,
    status: "low_stock",
    icon: "headphones",
  },
  {
    id: 103,
    name: "Nova Smartphone 5G",
    category: "Electronics",
    price: 899.0,
    stock: 0,
    status: "out_of_stock",
    icon: "smartphone",
  },
  {
    id: 104,
    name: "Lumen Smart Display",
    category: "Home",
    price: 249.0,
    stock: 42,
    status: "in_stock",
    icon: "tv",
  },
  {
    id: 105,
    name: "Echo Studio Speaker",
    category: "Audio",
    price: 329.0,
    stock: 15,
    status: "in_stock",
    icon: "speaker",
  },
  {
    id: 106,
    name: "Vertex Bluetooth Earbuds",
    category: "Audio",
    price: 129.0,
    stock: 4,
    status: "low_stock",
    icon: "headphones",
  },
  {
    id: 107,
    name: 'Orbit Tablet 11"',
    category: "Electronics",
    price: 549.0,
    stock: 30,
    status: "in_stock",
    icon: "tablet",
  },
  {
    id: 108,
    name: "Halo 4K Webcam",
    category: "Accessories",
    price: 99.0,
    stock: 18,
    status: "in_stock",
    icon: "camera",
  },
  {
    id: 109,
    name: "Flux Mechanical Keyboard",
    category: "Accessories",
    price: 149.0,
    stock: 0,
    status: "out_of_stock",
    icon: "keyboard",
  },
  {
    id: 110,
    name: "Aurora Power Bank 20K",
    category: "Accessories",
    price: 59.0,
    stock: 64,
    status: "in_stock",
    icon: "battery",
  },
  {
    id: 111,
    name: "Lumen Smart Bulb (4-pack)",
    category: "Home",
    price: 39.0,
    stock: 8,
    status: "low_stock",
    icon: "zap",
  },
  {
    id: 112,
    name: "Echo Soundbar Pro",
    category: "Audio",
    price: 499.0,
    stock: 22,
    status: "in_stock",
    icon: "speaker",
  },
];

export const CATEGORY_OPTIONS = [
  { label: "All categories", value: "all" },
  { label: "Electronics", value: "Electronics" },
  { label: "Audio", value: "Audio" },
  { label: "Accessories", value: "Accessories" },
  { label: "Home", value: "Home" },
];

export const STOCK_STATUS = {
  in_stock: { label: "In stock", color: "success" },
  low_stock: { label: "Low stock", color: "warning" },
  out_of_stock: { label: "Out of stock", color: "danger" },
};

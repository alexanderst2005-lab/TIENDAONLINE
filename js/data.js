/* ============================================
   TIENDA ONLINE — DATA.JS
   Configuración Central y Base de Datos de Productos

   Para modificar el número de WhatsApp:
   Cambiar el valor de CONFIG.whatsappNumber
   ============================================ */

'use strict';

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
  // Número de WhatsApp (57 + número sin espacios ni guiones)
  whatsappNumber: '573000000000',

  // Nombre de la tienda
  storeName: 'URBANO',

  // Moneda
  currency: 'COP',
  currencySymbol: '$',
  currencyLocale: 'es-CO',
};

// ============================================
// FUNCIÓN HELPER: FORMATEAR PRECIO
// ============================================
function formatPrice(amount) {
  return CONFIG.currencySymbol + amount.toLocaleString(CONFIG.currencyLocale);
}

// ============================================
// BASE DE DATOS DE PRODUCTOS
// ============================================
const PRODUCTS = [

  // ===== CAMISETAS =====
  {
    id: 'camiseta-001',
    name: 'Camiseta Clásica',
    slug: 'camiseta',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 41000,
    stock: 72,
    order: 1,
    isNew: false,
    images: ['images/cat-camisetas.jpg', 'images/hero1.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blanco',   hex: '#F5F3EF' },
      { name: 'Negro',    hex: '#111111' },
      { name: 'Gris',     hex: '#9E9E9E' },
      { name: 'Azul',     hex: '#3B5998' },
    ],
    description: 'Camiseta de alta calidad con corte moderno. Confeccionada en tela suave y resistente, ideal para el día a día. Disponible en tallas XS a XL.',
    featured: true,
    active: true,
  },
  {
    id: 'camiseta-002',
    name: 'Camiseta Manga Larga',
    slug: 'camiseta-manga-larga',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 45000,
    stock: 18,
    order: 2,
    isNew: true,
    images: ['images/prod-manga-larga.jpg', 'images/cat-camisetas.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Verde oliva', hex: '#5A6E47' },
      { name: 'Negro',       hex: '#111111' },
      { name: 'Crema',       hex: '#E8E0D0' },
    ],
    description: 'Camiseta manga larga de algodón premium. Corte entallado moderno, perfecta para días frescos o para layering. Acabados de calidad superior.',
    featured: true,
    active: true,
  },
  {
    id: 'camiseta-003',
    name: 'Camiseta Oversize',
    slug: 'camiseta-oversize',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 43000,
    stock: 30,
    order: 3,
    isNew: true,
    images: ['images/prod-oversize.jpg', 'images/cat-camisetas.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Negro',  hex: '#111111' },
      { name: 'Gris',   hex: '#9E9E9E' },
      { name: 'Blanco', hex: '#F5F3EF' },
    ],
    description: 'Camiseta oversize de estilo urbano. Corte amplio y relajado, ideal para un look streetwear o casual moderno. Tela gruesa de calidad.',
    featured: false,
    active: true,
  },

  // ===== CAMIBUSOS TIPO POLO =====
  {
    id: 'polo-001',
    name: 'Camibuso Tipo Polo',
    slug: 'camibuso-tipo-polo',
    category: 'polos',
    categoryLabel: 'Camibusos Tipo Polo',
    price: 39000,
    stock: 24,
    order: 4,
    isNew: false,
    images: ['images/cat-polo.jpg', 'images/destacado.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro',       hex: '#111111' },
      { name: 'Azul marino', hex: '#1B2A4A' },
      { name: 'Blanco',      hex: '#F5F3EF' },
    ],
    description: 'Camibuso tipo polo con diseño elegante y moderno. Perfecto para looks casuales o semiformales. Tejido de calidad con acabados premium.',
    featured: true,
    active: true,
  },
  {
    id: 'polo-002',
    name: 'Polo Clásico Cuello V',
    slug: 'polo-clasico-cuello-v',
    category: 'polos',
    categoryLabel: 'Camibusos Tipo Polo',
    price: 41000,
    stock: 0,
    order: 5,
    isNew: false,
    images: ['images/destacado.jpg', 'images/cat-polo.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Azul marino', hex: '#1B2A4A' },
      { name: 'Vino',        hex: '#6B1E1E' },
      { name: 'Gris',        hex: '#9E9E9E' },
    ],
    description: 'Polo cuello V de corte clásico y estilo atemporal. Tejido suave y transpirable, ideal para un look smart casual.',
    featured: false,
    active: true,
  },

  // ===== PANTALONETAS =====
  {
    id: 'pantaloneta-001',
    name: 'Pantaloneta de Algodón',
    slug: 'pantaloneta-de-algodon',
    category: 'pantalonetas',
    categoryLabel: 'Pantalonetas',
    price: 28000,
    stock: 11,
    order: 6,
    isNew: false,
    images: ['images/cat-pantaloneta.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#C8B89A' },
      { name: 'Negro', hex: '#111111' },
      { name: 'Gris',  hex: '#9E9E9E' },
    ],
    description: 'Pantaloneta de algodón suave y cómoda. Diseño urbano con acabados de calidad. Ideal para el calor y la comodidad del día a día.',
    featured: false,
    active: true,
  },
  {
    id: 'pantaloneta-002',
    name: 'Pantaloneta Deportiva',
    slug: 'pantaloneta-deportiva',
    category: 'pantalonetas',
    categoryLabel: 'Pantalonetas',
    price: 32000,
    stock: 5,
    order: 7,
    isNew: true,
    images: ['images/hero2.jpg', 'images/cat-pantaloneta.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', hex: '#111111' },
      { name: 'Azul',  hex: '#3B5998' },
      { name: 'Verde', hex: '#3A5A3A' },
    ],
    description: 'Pantaloneta deportiva con tela técnica de secado rápido. Perfecta para gym, deporte o uso casual. Cintura elástica con cordón ajustable.',
    featured: false,
    active: true,
  },

  // ===== JEANS =====
  {
    id: 'jeans-001',
    name: 'Jeans Corte Recto',
    slug: 'jeans',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 85000,
    stock: 11,
    order: 8,
    isNew: false,
    images: ['images/cat-jeans.jpg', 'images/hero3.jpg'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Azul clásico', hex: '#4A6FA5' },
      { name: 'Negro',        hex: '#111111' },
      { name: 'Gris oscuro',  hex: '#3A3A3A' },
    ],
    description: 'Jeans de corte recto moderno con denim de alta calidad. Comodidad y estilo en cada movimiento. Disponibles en tallas 28 a 36.',
    featured: true,
    active: true,
  },
  {
    id: 'jeans-002',
    name: 'Jeans Slim Fit',
    slug: 'jeans-slim-fit',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 89000,
    stock: 6,
    order: 9,
    isNew: true,
    images: ['images/prod-jeans-slim.jpg', 'images/cat-jeans.jpg'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Azul oscuro', hex: '#1A2C4A' },
      { name: 'Negro',       hex: '#111111' },
    ],
    description: 'Jeans slim fit de corte moderno y entallado. Denim premium con elasticidad para mayor comodidad. Un básico esencial del guardarropa masculino.',
    featured: true,
    active: true,
  },
  {
    id: 'jeans-003',
    name: 'Jeans Relaxed Fit',
    slug: 'jeans-relaxed-fit',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 87000,
    stock: 4,
    order: 10,
    isNew: true,
    images: ['images/hero3.jpg', 'images/cat-jeans.jpg'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Azul clásico', hex: '#4A6FA5' },
      { name: 'Gris',         hex: '#6B6B6B' },
    ],
    description: 'Jeans relaxed fit de corte holgado y relajado. Perfectos para un look casual y cómodo sin sacrificar el estilo. Denim lavado de alta calidad.',
    featured: false,
    active: true,
  },
  {
    id: 'camisetas-004',
    name: 'Camiseta Básica Premium',
    slug: 'camiseta-basica-premium',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 35000,
    stock: 100,
    order: 4,
    isNew: true,
    images: ['images/hero1.jpg', 'images/cat-camisetas.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Negro',  hex: '#111111' },
    ],
    description: 'Camiseta básica de algodón pima. Ideal para el uso diario con un tacto ultra suave.',
    featured: false,
    active: true,
  },
  {
    id: 'polo-002',
    name: 'Polo Manga Larga',
    slug: 'polo-manga-larga',
    category: 'polos',
    categoryLabel: 'Camibusos Tipo Polo',
    price: 55000,
    stock: 100,
    order: 6,
    isNew: false,
    images: ['images/destacado.jpg', 'images/cat-polo.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Azul Marino', hex: '#1A2C4A' },
      { name: 'Gris Oscuro', hex: '#3A3A3A' },
    ],
    description: 'Camibuso tipo polo manga larga. Perfecto para climas templados y un look smart-casual.',
    featured: true,
    active: true,
  },
  {
    id: 'pantaloneta-003',
    name: 'Pantaloneta Casual Urbana',
    slug: 'pantaloneta-casual-urbana',
    category: 'pantalonetas',
    categoryLabel: 'Pantalonetas',
    price: 36000,
    stock: 100,
    order: 8,
    isNew: true,
    images: ['images/cat-pantaloneta.jpg', 'images/hero2.jpg'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Beige', hex: '#D2B48C' },
      { name: 'Oliva', hex: '#556B2F' },
    ],
    description: 'Pantaloneta casual con bolsillos cargo discretos. Excelente para el fin de semana.',
    featured: false,
    active: true,
  },
  {
    id: 'jeans-004',
    name: 'Jeans Clásicos Azules',
    slug: 'jeans-clasicos-azules',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 79000,
    stock: 100,
    order: 11,
    isNew: true,
    images: ['images/hero3.jpg', 'images/cat-jeans.jpg'],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Azul Clásico', hex: '#4A6FA5' }
    ],
    description: 'El jean tradicional que no puede faltar. Corte regular, resistente y versátil.',
    featured: false,
    active: true,
  },
];

// ============================================
// CATEGORÍAS
// ============================================
const CATEGORIES = [
  { id: 'todas',        label: 'Todas las prendas',  slug: 'todas' },
  { id: 'camisetas',    label: 'Camisetas',           slug: 'camisetas',    image: 'images/cat-camisetas.jpg' },
  { id: 'polos',        label: 'Camibusos Tipo Polo', slug: 'polos',        image: 'images/cat-polo.jpg' },
  { id: 'pantalonetas', label: 'Pantalonetas',        slug: 'pantalonetas', image: 'images/cat-pantaloneta.jpg' },
  { id: 'jeans',        label: 'Jeans',               slug: 'jeans',        image: 'images/cat-jeans.jpg' },
];

// ============================================
// PRECIOS MIN/MAX (para slider de filtros)
// ============================================
const PRICE_MIN = 0;
const PRICE_MAX = Math.max(...PRODUCTS.map(p => p.price));

// ============================================
// HELPERS DE PRODUCTOS
// ============================================

function getAllProducts() {
  return PRODUCTS.filter(p => p.active);
}

function getProductsByCategory(categoryId) {
  if (categoryId === 'todas' || !categoryId) return getAllProducts();
  return PRODUCTS.filter(p => p.active && p.category === categoryId);
}

function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug && p.active) || null;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id && p.active) || null;
}

function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.active && p.featured);
}

function getRelatedProducts(product, limit = 4) {
  return PRODUCTS.filter(p => p.active && p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

function hasStock(product) {
  return true;
}

function getStockLabel(product) {
  return { label: 'Disponible', class: '' };
}

// ============================================
// RECENTLY VIEWED
// ============================================
const RECENTLY_VIEWED_KEY = 'urbano_recently_viewed';
const RECENTLY_VIEWED_MAX = 5;

function addRecentlyViewed(slug) {
  let viewed = getRecentlyViewed();
  viewed = [slug, ...viewed.filter(s => s !== slug)].slice(0, RECENTLY_VIEWED_MAX);
  try { localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(viewed)); } catch(e) {}
}

function getRecentlyViewed() {
  try { return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'); } catch(e) { return []; }
}

function getRecentlyViewedProducts(currentSlug) {
  return getRecentlyViewed()
    .filter(s => s !== currentSlug)
    .map(slug => getProductBySlug(slug))
    .filter(Boolean);
}

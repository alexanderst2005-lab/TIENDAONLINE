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
  whatsappNumber: '573128301547',

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
  return CONFIG.currencySymbol + ' ' + amount.toLocaleString(CONFIG.currencyLocale);
}

// ============================================
// BASE DE DATOS DE PRODUCTOS
// ============================================
const PRODUCTS = [

  // ===== SETS =====
  {
    id: 'set-001',
    name: 'Set Elegante Tejido',
    slug: 'set-elegante-tejido',
    category: 'sets',
    categoryLabel: 'Sets',
    price: 150000,
    stock: 10,
    order: 1,
    isNew: true,
    images: ['images/cat-sets.jpg', 'images/cat-vestidos.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Beige', hex: '#C8B49A' },
      { name: 'Negro', hex: '#111111' },
    ],
    description: 'Set de dos piezas en tejido suave y elegante. Top y pantalón amplio de cintura alta, ideal para ocasiones especiales o el día a día con estilo.',
    featured: true,
    active: true,
  },
  {
    id: 'set-002',
    name: 'Set Casual Chic',
    slug: 'set-casual-chic',
    category: 'sets',
    categoryLabel: 'Sets',
    price: 135000,
    stock: 8,
    order: 2,
    isNew: false,
    images: ['images/cat-vestidos.jpg', 'images/cat-sets.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blanco Marfil', hex: '#F5F0E8' },
      { name: 'Camel', hex: '#C19A6B' },
    ],
    description: 'Set casual con blusa y pantalón a juego. Confeccionado en tela liviana, perfecto para el verano con un toque sofisticado.',
    featured: false,
    active: true,
  },

  // ===== VESTIDOS =====
  {
    id: 'vestido-001',
    name: 'Vestido Noche Elegante',
    slug: 'vestido-noche-elegante',
    category: 'vestidos',
    categoryLabel: 'Vestidos',
    price: 280000,
    stock: 6,
    order: 3,
    isNew: true,
    images: ['images/cat-vestidos.jpg', 'images/hero1.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Negro', hex: '#111111' },
      { name: 'Vino', hex: '#722F37' },
    ],
    description: 'Vestido largo de un solo hombro con abertura lateral. Diseño sofisticado ideal para eventos nocturnos y ocasiones especiales.',
    featured: true,
    active: true,
  },
  {
    id: 'vestido-002',
    name: 'Vestido Midi Casual',
    slug: 'vestido-midi-casual',
    category: 'vestidos',
    categoryLabel: 'Vestidos',
    price: 195000,
    stock: 12,
    order: 4,
    isNew: false,
    images: ['images/cat-bermuda.jpg', 'images/cat-vestidos.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Rosa Palo', hex: '#E8B4A0' },
    ],
    description: 'Vestido midi de corte fluido, perfecto para el día a día. Versátil y cómodo, combina con sandalias o sneakers.',
    featured: false,
    active: true,
  },

  // ===== VESTIDOS AMERICANOS =====
  {
    id: 'vestido-americano-001',
    name: 'Vestido Americano Glam',
    slug: 'vestido-americano-glam',
    category: 'vestidos-americanos',
    categoryLabel: 'Vestidos Americanos',
    price: 420000,
    stock: 5,
    order: 5,
    isNew: true,
    images: ['images/cat-vestidos-americanos.jpg', 'images/hero3.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Verde Esmeralda', hex: '#2D7D46' },
      { name: 'Negro', hex: '#111111' },
    ],
    description: 'Vestido largo importado de Estados Unidos. Diseño exclusivo con bordados y escote en V profundo. Perfecto para bodas, graduaciones y eventos de gala.',
    featured: true,
    active: true,
  },
  {
    id: 'vestido-americano-002',
    name: 'Vestido Americano Clásico',
    slug: 'vestido-americano-clasico',
    category: 'vestidos-americanos',
    categoryLabel: 'Vestidos Americanos',
    price: 380000,
    stock: 7,
    order: 6,
    isNew: false,
    images: ['images/hero1.jpg', 'images/cat-vestidos-americanos.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dorado', hex: '#D4AF37' },
      { name: 'Rojo', hex: '#C0392B' },
    ],
    description: 'Vestido americano de colección exclusiva. Tela premium de alta costura, corte a medida para resaltar tu figura.',
    featured: false,
    active: true,
  },

  // ===== ENTERIZOS AMERICANOS =====
  {
    id: 'enterizo-americano-001',
    name: 'Enterizo Americano Chic',
    slug: 'enterizo-americano-chic',
    category: 'enterizos-americanos',
    categoryLabel: 'Enterizos Americanos',
    price: 320000,
    stock: 8,
    order: 7,
    isNew: true,
    images: ['images/cat-enterizo-americano.jpg', 'images/cat-vestidos-americanos.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Blanco Perla', hex: '#F0EDE8' },
      { name: 'Negro', hex: '#111111' },
    ],
    description: 'Enterizo americano de un solo hombro con cinturón dorado incluido. Importado y de edición limitada. Ideal para eventos formales y de gala.',
    featured: true,
    active: true,
  },

  // ===== JEANS =====
  {
    id: 'jeans-001',
    name: 'Jeans Push Up',
    slug: 'jeans-push-up',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 120000,
    stock: 20,
    order: 8,
    isNew: false,
    images: ['images/cat-jeans.jpg', 'images/hero3.jpg'],
    sizes: ['6', '8', '10', '12', '14'],
    colors: [
      { name: 'Azul Oscuro', hex: '#1B3A6B' },
      { name: 'Negro', hex: '#111111' },
    ],
    description: 'Jeans push up de tiro alto que realzan y moldean la figura. Tela elastizada de alta calidad con acabado premium.',
    featured: true,
    active: true,
  },
  {
    id: 'jeans-002',
    name: 'Jeans Wide Leg',
    slug: 'jeans-wide-leg',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 135000,
    stock: 15,
    order: 9,
    isNew: true,
    images: ['images/hero3.jpg', 'images/cat-jeans.jpg'],
    sizes: ['6', '8', '10', '12'],
    colors: [
      { name: 'Azul Clásico', hex: '#4A6FA5' },
      { name: 'Blanco', hex: '#F5F3EF' },
    ],
    description: 'Jeans de pierna ancha estilo wide leg. Tendencia 2025, corte recto y fluido ideal para looks modernos y sofisticados.',
    featured: false,
    active: true,
  },

  // ===== BERMUDAS =====
  {
    id: 'bermuda-001',
    name: 'Bermuda Lino Premium',
    slug: 'bermuda-lino-premium',
    category: 'bermudas',
    categoryLabel: 'Bermudas',
    price: 90000,
    stock: 18,
    order: 10,
    isNew: false,
    images: ['images/cat-bermuda.jpg', 'images/cat-sets.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Crema', hex: '#E8DCC8' },
      { name: 'Blanco', hex: '#FAFAFA' },
    ],
    description: 'Bermuda de lino de corte sastre con cinturón incluido. Ideal para climas cálidos, elegante y cómoda para cualquier ocasión.',
    featured: false,
    active: true,
  },

  // ===== ENTERIZOS =====
  {
    id: 'enterizo-001',
    name: 'Enterizo Gala Dorado',
    slug: 'enterizo-gala-dorado',
    category: 'enterizos',
    categoryLabel: 'Enterizos',
    price: 210000,
    stock: 6,
    order: 11,
    isNew: true,
    images: ['images/cat-enterizos.jpg', 'images/cat-enterizo-americano.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Dorado', hex: '#D4AF37' },
      { name: 'Negro', hex: '#111111' },
    ],
    description: 'Enterizo de gala con detalles dorados y cinturón a la cintura. Perfecto para eventos formales, cenas y celebraciones especiales.',
    featured: true,
    active: true,
  },
  {
    id: 'enterizo-002',
    name: 'Enterizo Casual Blanco',
    slug: 'enterizo-casual-blanco',
    category: 'enterizos',
    categoryLabel: 'Enterizos',
    price: 175000,
    stock: 10,
    order: 12,
    isNew: false,
    images: ['images/cat-enterizo-americano.jpg', 'images/cat-enterizos.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Rosa', hex: '#F4C2C2' },
    ],
    description: 'Enterizo casual de un hombro con falda pantalón. Versátil y elegante, ideal para salidas de día o noches informales.',
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

/* ============================================
   MONATELA BOUTIQUE — DATA.JS
   Configuración Central y Base de Datos de Productos
   Moda Femenina y Cuidado Corporal
   ============================================ */

'use strict';

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
  // Número de WhatsApp (57 + número sin espacios ni guiones)
  whatsappNumber: '573027642208',

  // Nombre de la tienda
  storeName: 'Monatela Boutique',

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
// BASE DE DATOS DE PRODUCTOS (MUJER Y CUIDADO CORPORAL)
// ============================================
const PRODUCTS = [

  // ===== BLUSAS Y TOPS =====
  {
    id: 'blusa-001',
    name: 'Blusa Elegante Seda',
    slug: 'blusa-elegante-seda',
    category: 'blusas',
    categoryLabel: 'Blusas y Tops',
    price: 85000,
    stock: 25,
    order: 1,
    isNew: true,
    images: ['images/cat-camisetas.jpg', 'images/hero1.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Blanco Perla', hex: '#FDFBF7' },
      { name: 'Rosa Pastel',  hex: '#F4C2C2' },
      { name: 'Negro',        hex: '#111111' },
    ],
    description: 'Blusa confeccionada en suave seda sintética de alta calidad. Ideal para ocasiones especiales o para un look de oficina sofisticado.',
    featured: true,
    active: true,
  },
  {
    id: 'top-001',
    name: 'Top Básico Algodón Orgánico',
    slug: 'top-basico-algodon-organico',
    category: 'blusas',
    categoryLabel: 'Blusas y Tops',
    price: 35000,
    stock: 40,
    order: 2,
    isNew: false,
    images: ['images/prod-manga-larga.jpg', 'images/cat-camisetas.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Gris Claro', hex: '#D3D3D3' },
      { name: 'Negro',  hex: '#111111' },
    ],
    description: 'El básico perfecto que no puede faltar en tu armario. Top de algodón orgánico, fresco y muy cómodo para el día a día.',
    featured: false,
    active: true,
  },

  // ===== VESTIDOS =====
  {
    id: 'vestido-001',
    name: 'Vestido Midi Floral',
    slug: 'vestido-midi-floral',
    category: 'vestidos',
    categoryLabel: 'Vestidos',
    price: 120000,
    stock: 15,
    order: 3,
    isNew: true,
    images: ['images/cat-polo.jpg', 'images/destacado.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Estampado Floral', hex: '#EAA9AE' },
    ],
    description: 'Hermoso vestido midi con estampado floral. Cuenta con ajuste en la cintura y caída ligera, perfecto para eventos de día o salidas casuales.',
    featured: true,
    active: true,
  },
  {
    id: 'vestido-002',
    name: 'Vestido Corto de Noche',
    slug: 'vestido-corto-de-noche',
    category: 'vestidos',
    categoryLabel: 'Vestidos',
    price: 145000,
    stock: 10,
    order: 4,
    isNew: true,
    images: ['images/destacado.jpg', 'images/cat-polo.jpg'],
    sizes: ['XS', 'S', 'M'],
    colors: [
      { name: 'Negro', hex: '#111111' },
      { name: 'Vino Tinto', hex: '#722F37' },
    ],
    description: 'Impactante vestido corto ideal para fiestas o cenas elegantes. Confeccionado en tela elástica que resalta tu silueta.',
    featured: true,
    active: true,
  },

  // ===== PANTALONES Y FALDAS =====
  {
    id: 'pantalon-001',
    name: 'Pantalón Palazzo Tiro Alto',
    slug: 'pantalon-palazzo-tiro-alto',
    category: 'pantalones',
    categoryLabel: 'Pantalones y Faldas',
    price: 95000,
    stock: 30,
    order: 5,
    isNew: false,
    images: ['images/cat-pantaloneta.jpg', 'images/hero2.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#F5F5DC' },
      { name: 'Negro', hex: '#111111' },
    ],
    description: 'Pantalón palazzo de tiro alto que alarga tus piernas y estiliza la figura. Tela de gran caída y movimiento.',
    featured: true,
    active: true,
  },
  {
    id: 'falda-001',
    name: 'Falda Midi Plisada',
    slug: 'falda-midi-plisada',
    category: 'pantalones',
    categoryLabel: 'Pantalones y Faldas',
    price: 82000,
    stock: 20,
    order: 6,
    isNew: true,
    images: ['images/hero2.jpg', 'images/cat-pantaloneta.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Verde Salvia', hex: '#728C69' },
      { name: 'Rosa Polvo', hex: '#DCAE96' },
    ],
    description: 'Falda midi con detalle de pliegues sutiles y cintura elástica. Versátil y romántica, combina fácilmente con tops o suéteres.',
    featured: false,
    active: true,
  },

  // ===== CUIDADO CORPORAL =====
  {
    id: 'cuidado-001',
    name: 'Crema Hidratante Corporal Frutos Rojos',
    slug: 'crema-hidratante-corporal-frutos-rojos',
    category: 'cuidado',
    categoryLabel: 'Cuidado Corporal',
    price: 45000,
    stock: 50,
    order: 7,
    isNew: true,
    images: ['images/prod-jeans-slim.jpg', 'images/cat-jeans.jpg'],
    sizes: ['250ml', '500ml'],
    colors: [
      { name: 'Frutos Rojos', hex: '#C21E56' },
    ],
    description: 'Crema corporal de rápida absorción con un exquisito aroma a frutos rojos. Mantiene tu piel suave, hidratada y luminosa durante todo el día.',
    featured: true,
    active: true,
  },
  {
    id: 'cuidado-002',
    name: 'Exfoliante de Café y Coco',
    slug: 'exfoliante-de-cafe-y-coco',
    category: 'cuidado',
    categoryLabel: 'Cuidado Corporal',
    price: 38000,
    stock: 35,
    order: 8,
    isNew: true,
    images: ['images/cat-jeans.jpg', 'images/hero3.jpg'],
    sizes: ['200g'],
    colors: [
      { name: 'Natural', hex: '#4B3621' },
    ],
    description: 'Exfoliante corporal natural a base de café y coco. Remueve células muertas, estimula la circulación y deja la piel renovada.',
    featured: true,
    active: true,
  },
  {
    id: 'cuidado-003',
    name: 'Aceite Corporal Iluminador',
    slug: 'aceite-corporal-iluminador',
    category: 'cuidado',
    categoryLabel: 'Cuidado Corporal',
    price: 52000,
    stock: 25,
    order: 9,
    isNew: false,
    images: ['images/hero3.jpg', 'images/prod-jeans-slim.jpg'],
    sizes: ['100ml'],
    colors: [
      { name: 'Brillo Dorado', hex: '#D4AF37' },
    ],
    description: 'Aceite seco con destellos dorados sutiles que nutre y aporta un brillo espectacular a tu piel sin sensación grasosa.',
    featured: false,
    active: true,
  },
];

// ============================================
// CATEGORÍAS (MUJER Y CUIDADO)
// ============================================
const CATEGORIES = [
  { id: 'todas',      label: 'Todos los productos', slug: 'todas' },
  { id: 'blusas',     label: 'Blusas y Tops',       slug: 'blusas',     image: 'images/cat-camisetas.jpg' },
  { id: 'vestidos',   label: 'Vestidos',            slug: 'vestidos',   image: 'images/cat-polo.jpg' },
  { id: 'pantalones', label: 'Pantalones y Faldas', slug: 'pantalones', image: 'images/cat-pantaloneta.jpg' },
  { id: 'cuidado',    label: 'Cuidado Corporal',    slug: 'cuidado',    image: 'images/cat-jeans.jpg' },
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
  return product.stock > 0;
}

function getStockLabel(product) {
  if (product.stock === 0) return { label: 'Agotado', class: 'out' };
  if (product.stock <= 5) return { label: `Últimas ${product.stock} unidades`, class: 'low' };
  return { label: 'Disponible', class: '' };
}

// ============================================
// RECENTLY VIEWED
// ============================================
const RECENTLY_VIEWED_KEY = 'monatela_recently_viewed';
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

/* ============================================
   URBANOO — DATA.JS
   Configuración Central y Base de Datos de Productos
   Ropa Masculina, Urbana y Elegante
   ============================================ */

'use strict';

// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
  // Número de WhatsApp (57 + número sin espacios ni guiones)
  whatsappNumber: '573027642208',

  // Nombre de la tienda
  storeName: 'URBANOO',

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
// BASE DE DATOS DE PRODUCTOS (HOMBRE)
// ============================================
const PRODUCTS = [

  // ===== CAMISETAS =====
  {
    id: 'camiseta-001',
    name: 'Camiseta Clásica Cuello Redondo',
    slug: 'camiseta-clasica-cuello-redondo',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 45000,
    stock: 72,
    order: 1,
    isNew: false,
    images: ['images/cat-camisetas.jpg', 'images/hero1.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blanco',   hex: '#F5F3EF' },
      { name: 'Negro',    hex: '#111111' },
      { name: 'Gris',     hex: '#9E9E9E' },
      { name: 'Azul',     hex: '#3B5998' },
    ],
    description: 'Camiseta de alta calidad con corte regular moderno. Confeccionada en 100% algodón suave y resistente, ideal para el día a día o combinaciones urbanas.',
    featured: true,
    active: true,
  },
  {
    id: 'camiseta-002',
    name: 'Camiseta Manga Larga Premium',
    slug: 'camiseta-manga-larga-premium',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 52000,
    stock: 25,
    order: 2,
    isNew: true,
    images: ['images/prod-manga-larga.jpg', 'images/cat-camisetas.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Verde Oliva', hex: '#5A6E47' },
      { name: 'Negro',       hex: '#111111' },
      { name: 'Crema',       hex: '#E8E0D0' },
    ],
    description: 'Camiseta manga larga de algodón peinado premium. Corte entallado contemporáneo, perfecta para climas templados o para lucir en capas con estilo.',
    featured: true,
    active: true,
  },
  {
    id: 'camiseta-003',
    name: 'Camiseta Oversize Heavyweight',
    slug: 'camiseta-oversize-heavyweight',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 55000,
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
    description: 'Camiseta oversize de corte boxy y caída pesada. Streetwear de alto nivel con cuello reforzado y costuras dobles para máxima durabilidad.',
    featured: false,
    active: true,
  },
  {
    id: 'camiseta-004',
    name: 'Camiseta Básica Pima Cotton',
    slug: 'camiseta-basica-pima-cotton',
    category: 'camisetas',
    categoryLabel: 'Camisetas',
    price: 49000,
    stock: 45,
    order: 4,
    isNew: true,
    images: ['images/hero1.jpg', 'images/cat-camisetas.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Negro',  hex: '#111111' },
    ],
    description: 'Camiseta básica de algodón pima ultra suave. Tacto sedoso inigualable, transpirable y resistente a múltiples lavados sin perder su forma original.',
    featured: false,
    active: true,
  },

  // ===== CAMIBUSOS TIPO POLO =====
  {
    id: 'polo-001',
    name: 'Camibuso Tipo Polo Clásico',
    slug: 'camibuso-tipo-polo-clasico',
    category: 'polos',
    categoryLabel: 'Camibusos Tipo Polo',
    price: 65000,
    stock: 28,
    order: 5,
    isNew: false,
    images: ['images/cat-polo.jpg', 'images/destacado.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Azul Marino', hex: '#1B2A4A' },
      { name: 'Negro',       hex: '#111111' },
      { name: 'Blanco',      hex: '#F5F3EF' },
    ],
    description: 'Camibuso tipo polo de corte clásico confeccionado en piqué de algodón mercerizado. Cuello y puños tejidos acanalados que conservan su estructura.',
    featured: true,
    active: true,
  },
  {
    id: 'polo-002',
    name: 'Polo Manga Larga Smart Casual',
    slug: 'polo-manga-larga-smart-casual',
    category: 'polos',
    categoryLabel: 'Camibusos Tipo Polo',
    price: 75000,
    stock: 20,
    order: 6,
    isNew: true,
    images: ['images/destacado.jpg', 'images/cat-polo.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro Carbón', hex: '#222222' },
      { name: 'Gris Oscuro',  hex: '#3A3A3A' },
      { name: 'Azul Marino',  hex: '#1B2A4A' },
    ],
    description: 'Polo manga larga con botonadura oculta y confección refinada. La prenda ideal para transicionar del trabajo a reuniones y ocasiones semiformales.',
    featured: true,
    active: true,
  },

  // ===== PANTALONETAS =====
  {
    id: 'pantaloneta-001',
    name: 'Bermuda Chino Urbana',
    slug: 'bermuda-chino-urbana',
    category: 'pantalonetas',
    categoryLabel: 'Pantalonetas',
    price: 69000,
    stock: 35,
    order: 7,
    isNew: false,
    images: ['images/cat-pantaloneta.jpg', 'images/hero2.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#C8B89A' },
      { name: 'Negro', hex: '#111111' },
      { name: 'Azul',  hex: '#3B5998' },
    ],
    description: 'Pantaloneta tipo bermuda chino en drill stretch de alto gramaje. Cintura anatómica, bolsillos laterales profundos y largo ideal justo arriba de la rodilla.',
    featured: true,
    active: true,
  },
  {
    id: 'pantaloneta-002',
    name: 'Pantaloneta Deportiva Stretch',
    slug: 'pantaloneta-deportiva-stretch',
    category: 'pantalonetas',
    categoryLabel: 'Pantalonetas',
    price: 49000,
    stock: 40,
    order: 8,
    isNew: true,
    images: ['images/hero2.jpg', 'images/cat-pantaloneta.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Negro', hex: '#111111' },
      { name: 'Gris',  hex: '#555555' },
      { name: 'Azul',  hex: '#2B4A78' },
    ],
    description: 'Pantaloneta deportiva con tela técnica de secado ultra rápido y elasticidad en 4 direcciones. Perfecta para entrenamiento, running o descanso casual.',
    featured: false,
    active: true,
  },

  // ===== JEANS =====
  {
    id: 'jeans-001',
    name: 'Jeans Slim Fit Denim Premium',
    slug: 'jeans-slim-fit-denim-premium',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 110000,
    stock: 30,
    order: 9,
    isNew: true,
    images: ['images/prod-jeans-slim.jpg', 'images/cat-jeans.jpg'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Azul Índigo', hex: '#1A2C4A' },
      { name: 'Negro',       hex: '#111111' },
    ],
    description: 'Jeans slim fit confeccionados en denim rígido con 2% de elastano para un ajuste preciso y cómodo. Lavado artesanal en tono índigo oscuro.',
    featured: true,
    active: true,
  },
  {
    id: 'jeans-002',
    name: 'Jeans Corte Recto Straight',
    slug: 'jeans-corte-recto-straight',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 105000,
    stock: 25,
    order: 10,
    isNew: false,
    images: ['images/cat-jeans.jpg', 'images/hero3.jpg'],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Azul Clásico', hex: '#3B5998' },
      { name: 'Gris Humo',    hex: '#4A4A4A' },
      { name: 'Negro',        hex: '#111111' },
    ],
    description: 'El jean de corte recto atemporal que combina con todo. Tiro medio, confección reforzada y tela resistente diseñada para acompañarte por años.',
    featured: true,
    active: true,
  },
  {
    id: 'jeans-003',
    name: 'Jeans Relaxed Fit Streetwear',
    slug: 'jeans-relaxed-fit-streetwear',
    category: 'jeans',
    categoryLabel: 'Jeans',
    price: 115000,
    stock: 18,
    order: 11,
    isNew: true,
    images: ['images/hero3.jpg', 'images/prod-jeans-slim.jpg'],
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Azul Vintage', hex: '#5B7FA8' },
      { name: 'Negro Lavado', hex: '#2A2A2A' },
    ],
    description: 'Jeans relaxed fit de corte ancho y relajado. Tendencia streetwear que ofrece máxima libertad de movimiento sin perder la silueta definida.',
    featured: false,
    active: true,
  },
];

// ============================================
// CATEGORÍAS (HOMBRE)
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
const RECENTLY_VIEWED_KEY = 'bufalo_recently_viewed';
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

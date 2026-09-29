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
  whatsappNumber: '573229148593',

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
let PRODUCTS = [];
window.PRODUCTS_READY = fetch("/api/products").then(r => r.json()).then(data => { PRODUCTS = data; }).catch(e => console.error("Error loading DB", e));

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
const PRICE_MAX = 500000;

// ============================================
// HELPERS DE PRODUCTOS
// ============================================

function getAllProducts() {
  return PRODUCTS.filter(p => p.isActive);
}

function getProductsByCategory(categoryId) {
  if (categoryId === 'todas' || !categoryId) return getAllProducts();
  return PRODUCTS.filter(p => p.isActive && p.category === categoryId);
}

function getProductBySlug(slug) {
  return PRODUCTS.find(p => p.slug === slug && p.isActive) || null;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id && p.isActive) || null;
}

function getFeaturedProducts() {
  return PRODUCTS.filter(p => p.isActive && p.isFeatured);
}

function getRelatedProducts(product, limit = 4) {
  return PRODUCTS.filter(p => p.isActive && p.category === product.category && p.id !== product.id)
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


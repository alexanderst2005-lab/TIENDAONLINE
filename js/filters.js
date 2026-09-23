/* ============================================
   TIENDA ONLINE — FILTERS.JS
   Motor de filtros, búsqueda, ordenamiento
   y lógica del catálogo
   ============================================ */

'use strict';

// ============================================
// ESTADO DE FILTROS
// ============================================
const FilterState = {
  category:      'todas',
  sizes:         [],
  maxPrice:      PRICE_MAX,
  availableOnly: false,
  search:        '',
  sort:          'featured',
};

// ============================================
// MOTOR DE FILTRADO
// ============================================
function applyFilters(products) {
  let result = [...products];

  // 1. Categoría
  if (FilterState.category !== 'todas') {
    result = result.filter(p => p.category === FilterState.category);
  }

  // 2. Tallas
  if (FilterState.sizes.length > 0) {
    result = result.filter(p =>
      FilterState.sizes.some(s => p.sizes.includes(s))
    );
  }

  // 3. Precio máximo
  result = result.filter(p => p.price <= FilterState.maxPrice);

  // 4. Solo disponibles
  if (FilterState.availableOnly) {
    result = result.filter(p => p.stock > 0);
  }

  // 5. Búsqueda
  if (FilterState.search.trim()) {
    const q = FilterState.search.trim().toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // 6. Ordenar
  switch (FilterState.sort) {
    case 'featured':
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.order - b.order);
      break;
    case 'newest':
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || a.order - b.order);
      break;
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      break;
  }

  return result;
}

// ============================================
// RENDER PRODUCTOS EN CATÁLOGO
// ============================================
function renderCatalogProducts() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const all     = getAllProducts();
  const filtered = applyFilters(all);

  // Actualizar contador
  const countEl = document.getElementById('product-count');
  if (countEl) {
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'prenda' : 'prendas'}`;
  }

  // Grid vacío
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:5rem 0">
        <p style="color:var(--color-text-secondary);font-size:1.1rem;margin-bottom:1.5rem">
          No hay prendas con esos filtros.
        </p>
        <button class="btn btn-outline-dark" onclick="clearFilters()">Limpiar filtros</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const stock    = getStockLabel(p);
    const hasTwo   = p.images.length > 1;
    const outOfStock = p.stock === 0;

    return `
      <article class="product-card${outOfStock ? ' out-of-stock' : ''}" data-reveal>
        <div class="card-image-wrap${hasTwo ? ' has-hover-img' : ''}" style="cursor:pointer" onclick="window.location.href='producto.html?id=${p.slug}'">
          <img
            class="card-img-main"
            src="${p.images[0]}"
            alt="${p.name}"
            loading="lazy"
          >
          ${hasTwo ? `<img class="card-img-hover" src="${p.images[1]}" alt="${p.name} vista 2" loading="lazy">` : ''}

          ${p.isNew ? '<span class="card-badge">Nuevo</span>' : ''}
          ${outOfStock ? '<span class="card-badge out">Agotado</span>' : ''}

          <div class="card-actions">
            ${outOfStock
              ? `<button class="btn btn-outline-dark btn-full" disabled style="opacity:.5;cursor:not-allowed">Agotado</button>`
              : `<button class="btn btn-primary btn-full" onclick="event.stopPropagation(); openQuickSelect('${p.id}')">
                   Agregar al Carrito
                 </button>`
            }
          </div>

          <button class="card-wishlist" aria-label="Favoritos">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <div class="card-body">
          <p class="card-category">${p.categoryLabel}</p>
          <h2 class="card-name">
            <a href="producto.html?id=${p.slug}" style="text-decoration:none;color:inherit">${p.name}</a>
          </h2>
          <div class="card-meta">
            <span class="card-price">${formatPrice(p.price)}</span>
            <span class="stock-badge ${stock.class === 'out' ? 'out' : stock.class === 'low' ? 'low' : ''}">${stock.label}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Scroll reveal
  const els = grid.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06 });
  els.forEach(el => obs.observe(el));
}

// ============================================
// FILTER DRAWER
// ============================================
function openFilterDrawer() {
  document.getElementById('filter-drawer').classList.add('active');
  document.getElementById('filter-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFilterDrawer() {
  document.getElementById('filter-drawer').classList.remove('active');
  document.getElementById('filter-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function clearFilters() {
  FilterState.category      = 'todas';
  FilterState.sizes         = [];
  FilterState.maxPrice      = PRICE_MAX;
  FilterState.availableOnly = false;
  FilterState.search        = '';

  // Reset UI
  document.querySelectorAll('.fdrawer-cat-item').forEach(b => b.classList.toggle('active', b.dataset.cat === 'todas'));
  document.querySelectorAll('.fdrawer-size-btn').forEach(b => b.classList.remove('active'));

  const priceRange = document.getElementById('fdrawer-price-range');
  const priceDisplay = document.getElementById('fdrawer-price-display');
  if (priceRange) {
    priceRange.value = PRICE_MAX;
    if (priceDisplay) priceDisplay.textContent = formatPrice(PRICE_MAX);
  }

  const avail = document.getElementById('fdrawer-available');
  if (avail) avail.checked = false;

  const search = document.getElementById('catalog-search');
  if (search) search.value = '';

  renderCatalogProducts();
  updateActiveFiltersCount();
}

window.clearFilters = clearFilters;

// Count active filters for badge
function updateActiveFiltersCount() {
  let count = 0;
  if (FilterState.category !== 'todas') count++;
  count += FilterState.sizes.length;
  if (FilterState.maxPrice < PRICE_MAX) count++;
  if (FilterState.availableOnly) count++;

  const badge = document.getElementById('filter-count-badge');
  if (badge) {
    badge.textContent  = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ============================================
// INIT FILTER DRAWER
// ============================================
function initFilterDrawer() {
  // Collect all unique sizes across products
  const allSizes = [...new Set(getAllProducts().flatMap(p => p.sizes))];

  // Category list
  const catList = document.getElementById('fdrawer-cat-list');
  if (catList) {
    catList.innerHTML = CATEGORIES.map(cat => `
      <button
        class="fdrawer-cat-item ${cat.id === FilterState.category ? 'active' : ''}"
        data-cat="${cat.id}"
      >
        ${cat.label}
      </button>
    `).join('');

    catList.querySelectorAll('.fdrawer-cat-item').forEach(btn => {
      btn.addEventListener('click', () => {
        FilterState.category = btn.dataset.cat;
        catList.querySelectorAll('.fdrawer-cat-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCatalogProducts();
        updateActiveFiltersCount();
      });
    });
  }

  // Size grid
  const sizeGrid = document.getElementById('fdrawer-size-grid');
  if (sizeGrid) {
    // Common sizes in order
    const orderedSizes = ['XS','S','M','L','XL','XXL','28','30','32','34','36','38'];
    const sortedSizes  = allSizes.sort((a, b) => {
      const ai = orderedSizes.indexOf(a);
      const bi = orderedSizes.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    sizeGrid.innerHTML = sortedSizes.map(size => `
      <button class="fdrawer-size-btn" data-size="${size}">${size}</button>
    `).join('');

    sizeGrid.querySelectorAll('.fdrawer-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.dataset.size;
        if (FilterState.sizes.includes(size)) {
          FilterState.sizes = FilterState.sizes.filter(s => s !== size);
          btn.classList.remove('active');
        } else {
          FilterState.sizes.push(size);
          btn.classList.add('active');
        }
        renderCatalogProducts();
        updateActiveFiltersCount();
      });
    });
  }

  // Price range
  const priceRange   = document.getElementById('fdrawer-price-range');
  const priceDisplay = document.getElementById('fdrawer-price-display');
  if (priceRange) {
    priceRange.min   = PRICE_MIN;
    priceRange.max   = PRICE_MAX;
    priceRange.value = PRICE_MAX;
    if (priceDisplay) priceDisplay.textContent = formatPrice(PRICE_MAX);

    priceRange.addEventListener('input', () => {
      FilterState.maxPrice = parseInt(priceRange.value);
      if (priceDisplay) priceDisplay.textContent = formatPrice(FilterState.maxPrice);
      renderCatalogProducts();
      updateActiveFiltersCount();
    });
  }

  // Available only checkbox
  const availCheckbox = document.getElementById('fdrawer-available');
  if (availCheckbox) {
    availCheckbox.addEventListener('change', () => {
      FilterState.availableOnly = availCheckbox.checked;
      renderCatalogProducts();
      updateActiveFiltersCount();
    });
  }

  // Drawer open/close
  document.getElementById('filter-trigger-btn')?.addEventListener('click', openFilterDrawer);
  document.getElementById('fdrawer-close-btn')?.addEventListener('click', closeFilterDrawer);
  document.getElementById('filter-overlay')?.addEventListener('click', closeFilterDrawer);
  document.getElementById('fdrawer-clear-btn')?.addEventListener('click', clearFilters);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFilterDrawer(); });
}

// ============================================
// INIT SORT
// ============================================
function initSort() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', () => {
    FilterState.sort = sortSelect.value;
    renderCatalogProducts();
  });
}

// ============================================
// INIT SEARCH
// ============================================
function initSearch() {
  const searchInput = document.getElementById('catalog-search');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      FilterState.search = searchInput.value;
      renderCatalogProducts();
    }, 250);
  });

  // Clear button
  const clearSearch = document.getElementById('catalog-search-clear');
  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value  = '';
      FilterState.search = '';
      renderCatalogProducts();
    });
    searchInput.addEventListener('input', () => {
      clearSearch.style.display = searchInput.value ? 'flex' : 'none';
    });
  }
}

// ============================================
// URL PARAMS — INIT FROM QUERY STRING
// ============================================
function initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat && cat !== 'todas') {
    FilterState.category = cat;
  }
}

// ============================================
// INIT ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initFromURL();
  initFilterDrawer();
  initSort();
  initSearch();
  renderCatalogProducts();
  updateActiveFiltersCount();
});

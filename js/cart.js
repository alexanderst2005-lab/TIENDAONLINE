/* ============================================
   TIENDA ONLINE — CART.JS
   Lógica completa del carrito de compras
   Persistencia con localStorage
   ============================================ */

'use strict';

// ============================================
// CART STATE
// ============================================
const CART_KEY = 'tienda_cart';

const Cart = {
  // Obtener carrito del localStorage
  get() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  // Guardar carrito
  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this.updateUI();
    this.dispatchEvent();
  },

  // Agregar producto
  addItem(productId, size, quantity = 1) {
    const items = this.get();
    const product = getProductById(productId);
    if (!product) return false;

    const existingIndex = items.findIndex(
      item => item.productId === productId && item.size === size
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        size,
        quantity,
      });
    }

    this.save(items);
    showToast(`${product.name} agregado al carrito`);
    return true;
  },

  // Remover item
  removeItem(index) {
    const items = this.get();
    items.splice(index, 1);
    this.save(items);
  },

  // Actualizar cantidad
  updateQuantity(index, quantity) {
    const items = this.get();
    if (!items[index]) return;
    if (quantity <= 0) {
      this.removeItem(index);
      return;
    }
    items[index].quantity = quantity;
    this.save(items);
  },

  // Vaciar carrito
  clear() {
    localStorage.removeItem(CART_KEY);
    this.updateUI();
    this.dispatchEvent();
  },

  // Obtener total de items
  getItemCount() {
    return this.get().reduce((sum, item) => sum + item.quantity, 0);
  },

  // Obtener subtotal
  getSubtotal() {
    return this.get().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Actualizar badge del header
  updateUI() {
    const count = this.getItemCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
      if (count > 0) {
        el.classList.add('bump');
        setTimeout(() => el.classList.remove('bump'), 300);
      }
    });
  },

  // Despachar evento personalizado
  dispatchEvent() {
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { items: this.get(), count: this.getItemCount() }
    }));
  }
};

// ============================================
// CART SIDEBAR UI
// ============================================
function openCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar && overlay) {
    renderCartSidebar();
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderCartSidebar() {
  const container = document.getElementById('cart-items-container');
  const emptyMsg  = document.getElementById('cart-empty');
  const footer    = document.getElementById('cart-footer');
  if (!container) return;

  const items = Cart.get();

  if (items.length === 0) {
    container.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'flex';
    if (footer)   footer.style.display   = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (footer)   footer.style.display   = 'block';

  container.innerHTML = items.map((item, index) => `
    <div class="cart-item" data-index="${index}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-size">Talla: ${item.size}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="Cart.updateQuantity(${index}, ${item.quantity - 1})">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="Cart.updateQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
        <button class="cart-item-remove" onclick="Cart.removeItem(${index})" title="Eliminar">
          <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  // Update totals
  const subtotal = Cart.getSubtotal();
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl    = document.getElementById('cart-total');
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl)    totalEl.textContent    = formatPrice(subtotal);
}

// Re-render on cart updates
window.addEventListener('cartUpdated', () => {
  const sidebar = document.getElementById('cart-sidebar');
  if (sidebar && sidebar.classList.contains('active')) {
    renderCartSidebar();
  }
});

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, duration = 2800) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
    ${message}
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================
// WISHLIST STATE & HELPER
// ============================================
const WISHLIST_KEY = 'luxury_wishlist';

const Wishlist = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch {
      return [];
    }
  },
  has(productId) {
    return this.get().includes(productId);
  },
  toggle(productId) {
    let items = this.get();
    const index = items.indexOf(productId);
    let added = false;
    if (index >= 0) {
      items.splice(index, 1);
      added = false;
    } else {
      items.push(productId);
      added = true;
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    this.updateUI();
    return added;
  },
  remove(productId) {
    let items = this.get();
    const index = items.indexOf(productId);
    if (index >= 0) {
      items.splice(index, 1);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
      this.updateUI();
      renderWishlistSidebar();
      showToast('Eliminado de tus favoritos');
    }
  },
  getCount() {
    return this.get().length;
  },
  updateUI() {
    const count = this.getCount();
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    const items = this.get();
    document.querySelectorAll('.card-wishlist').forEach(btn => {
      const card = btn.closest('.product-card');
      const href = card?.querySelector('.card-name a')?.getAttribute('href') || '';
      const slugMatch = href.match(/id=([^&]+)/);
      if (slugMatch) {
        const p = typeof getProductBySlug === 'function' ? getProductBySlug(slugMatch[1]) : null;
        if (p) btn.classList.toggle('favorited', items.includes(p.id));
      }
    });

    // Update product detail heart if on product page
    const detailHeart = document.getElementById('product-wishlist-btn');
    if (detailHeart) {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('id');
      if (slug && typeof getProductBySlug === 'function') {
        const currentP = getProductBySlug(slug);
        if (currentP) {
          detailHeart.classList.toggle('favorited', items.includes(currentP.id));
        }
      }
    }

    // If wishlist sidebar is open, re-render
    const ws = document.getElementById('wishlist-sidebar');
    if (ws && ws.classList.contains('active')) {
      renderWishlistSidebar();
    }
  }
};

// ============================================
// WISHLIST SIDEBAR UI
// ============================================
function ensureWishlistDOM() {
  if (document.getElementById('wishlist-sidebar')) return;

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.id = 'wishlist-overlay';
  document.body.appendChild(overlay);

  const aside = document.createElement('aside');
  aside.className = 'cart-sidebar';
  aside.id = 'wishlist-sidebar';
  aside.innerHTML = `
    <div class="cart-header">
      <h2 class="cart-title">Mis Favoritos</h2>
      <button class="cart-close" id="wishlist-close-btn" aria-label="Cerrar">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="cart-items" id="wishlist-items-container">
      <div class="cart-empty" id="wishlist-empty">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <div>
          <p style="font-weight:600;margin-bottom:.5rem">No tienes favoritos aún</p>
          <p style="font-size:.875rem;color:var(--color-text-secondary)">Guarda las prendas que más te gusten para verlas aquí</p>
        </div>
      </div>
    </div>
    <div class="cart-footer" id="wishlist-footer" style="display:none; padding:1.5rem; border-top:1px solid var(--color-border); text-align:center;">
      <a href="catalogo.html" class="btn btn-outline-dark btn-full">Explorar Más Prendas</a>
    </div>
  `;
  document.body.appendChild(aside);

  overlay.addEventListener('click', closeWishlist);
  document.getElementById('wishlist-close-btn').addEventListener('click', closeWishlist);
}

function openWishlist() {
  ensureWishlistDOM();
  const sidebar = document.getElementById('wishlist-sidebar');
  const overlay = document.getElementById('wishlist-overlay');
  if (sidebar && overlay) {
    renderWishlistSidebar();
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeWishlist() {
  const sidebar = document.getElementById('wishlist-sidebar');
  const overlay = document.getElementById('wishlist-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderWishlistSidebar() {
  ensureWishlistDOM();
  const container = document.getElementById('wishlist-items-container');
  const emptyMsg  = document.getElementById('wishlist-empty');
  const footer    = document.getElementById('wishlist-footer');
  if (!container) return;

  const itemIds = Wishlist.get();
  const products = itemIds
    .map(id => typeof getProductById === 'function' ? getProductById(id) : null)
    .filter(Boolean);

  if (products.length === 0) {
    container.innerHTML = `
      <div class="cart-empty" style="display:flex;">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <div>
          <p style="font-weight:600;margin-bottom:.5rem">No tienes favoritos aún</p>
          <p style="font-size:.875rem;color:var(--color-text-secondary)">Guarda las prendas que más te gusten para verlas aquí</p>
        </div>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  container.innerHTML = products.map(p => `
    <div class="cart-item" data-wishlist-item="${p.id}" style="padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border); display:flex; gap:1rem; align-items:center;">
      <a href="producto.html?id=${p.slug}">
        <img class="cart-item-img" src="${p.images[0]}" alt="${p.name}" loading="lazy" style="object-fit:cover; width:75px; height:95px; flex-shrink:0;">
      </a>
      <div class="cart-item-info" style="flex:1;">
        <a href="producto.html?id=${p.slug}" style="text-decoration:none; color:inherit;">
          <div class="cart-item-name" style="font-weight:600; font-size:0.95rem; margin-bottom:0.2rem;">${p.name}</div>
        </a>
        <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-text-secondary); margin-bottom:0.35rem;">${p.categoryLabel}</div>
        <div class="cart-item-price" style="font-size:0.95rem; font-weight:700; margin-bottom:0.6rem;">${formatPrice(p.price)}</div>
        <div>
          <a href="producto.html?id=${p.slug}" class="btn btn-outline-dark" style="display:inline-block; font-size:0.7rem; padding:6px 14px; letter-spacing:0.1em; text-transform:uppercase; text-decoration:none;">Ver Prenda</a>
        </div>
      </div>
      <button class="cart-item-remove" onclick="Wishlist.remove('${p.id}')" title="Eliminar de favoritos" style="align-self:flex-start; margin-top:4px;">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  `).join('');
}

// ============================================
// INIT: Update cart badge and wishlist on page load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateUI();
  Wishlist.updateUI();

  // Cart icon click
  document.querySelectorAll('[data-open-cart]').forEach(btn => {
    btn.addEventListener('click', openCart);
  });

  // Wishlist icon click
  document.querySelectorAll('[data-open-wishlist]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openWishlist();
    });
  });

  // Overlay click to close cart
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', closeCart);

  // Close button cart
  const closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCart);

  // Global card wishlist clicks
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-wishlist');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const href = card?.querySelector('.card-name a')?.getAttribute('href') || '';
      const slugMatch = href.match(/id=([^&]+)/);
      if (slugMatch) {
        const p = typeof getProductBySlug === 'function' ? getProductBySlug(slugMatch[1]) : null;
        if (p) {
          const added = Wishlist.toggle(p.id);
          btn.classList.toggle('favorited', added);
          showToast(added ? `${p.name} agregado a favoritos` : `${p.name} eliminado de favoritos`);
        }
      }
    }
  });
});

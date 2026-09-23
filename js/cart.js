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
  }
};

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

  // Overlay click to close
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', closeCart);

  // Close button
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

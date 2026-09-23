/* ============================================
   TIENDA ONLINE — QUICKSELECT.JS
   Modal de selección rápida: Talla + Color
   Se activa al presionar "Agregar al Carrito"
   desde las tarjetas de producto
   ============================================ */

'use strict';

(function () {

  // Estado del modal
  const QS = {
    productId: null,
    selectedSize: null,
    selectedColor: null,
    quantity: 1,
  };

  // ============================================
  // ABRIR MODAL
  // ============================================
  function openQuickSelect(productId) {
    const product = getProductById(productId);
    if (!product) return;

    // Reset state
    QS.productId   = productId;
    QS.selectedSize  = null;
    QS.selectedColor = null;
    QS.quantity    = 1;

    // Render content
    renderModal(product);

    // Show
    document.getElementById('qs-overlay').classList.add('active');
    document.getElementById('qs-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ============================================
  // CERRAR MODAL
  // ============================================
  function closeQuickSelect() {
    document.getElementById('qs-overlay').classList.remove('active');
    document.getElementById('qs-modal').classList.remove('active');
    document.body.style.overflow = '';
  }

  // ============================================
  // RENDER MODAL CONTENT
  // ============================================
  function renderModal(product) {
    // Product summary
    document.getElementById('qs-img').src       = product.images[0];
    document.getElementById('qs-img').alt       = product.name;
    document.getElementById('qs-name').textContent  = product.name;
    document.getElementById('qs-price').textContent = formatPrice(product.price);
    document.getElementById('qs-modal-title').textContent = 'Elige tu talla';

    // Reset displays
    document.getElementById('qs-size-val').textContent  = '—';
    document.getElementById('qs-color-val').textContent = '—';
    document.getElementById('qs-qty-val').textContent   = '1';
    QS.quantity = 1;

    // ---- SIZES ----
    const sizeContainer = document.getElementById('qs-sizes');
    sizeContainer.innerHTML = product.sizes.map(size => `
      <button class="qs-size-btn" data-size="${size}" onclick="QSSelectSize('${size}')">
        ${size}
      </button>
    `).join('');

    // ---- COLORS ----
    const colorSection   = document.getElementById('qs-color-section');
    const colorContainer = document.getElementById('qs-colors');

    if (product.colors && product.colors.length > 0) {
      colorSection.style.display = 'block';
      colorContainer.innerHTML = product.colors.map(color => `
        <button
          class="qs-color-btn"
          data-color="${color.name}"
          onclick="QSSelectColor('${color.name}', '${color.hex}')"
          title="${color.name}"
        >
          <span class="qs-color-swatch" style="background:${color.hex}"></span>
          ${color.name}
        </button>
      `).join('');
    } else {
      colorSection.style.display = 'none';
    }

    // ---- LINK TO PRODUCT ----
    const detailLink = document.getElementById('qs-detail-link');
    if (detailLink) {
      detailLink.href = `producto.html?id=${product.slug}`;
    }
  }

  // ============================================
  // SELECT SIZE
  // ============================================
  window.QSSelectSize = function (size) {
    QS.selectedSize = size;
    document.getElementById('qs-size-val').textContent = size;
    document.querySelectorAll('.qs-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === size);
    });
    // Remove error state if present
    document.getElementById('qs-sizes').classList.remove('qs-shake');
  };

  // ============================================
  // SELECT COLOR
  // ============================================
  window.QSSelectColor = function (colorName, colorHex) {
    QS.selectedColor = colorName;
    document.getElementById('qs-color-val').textContent = colorName;
    document.querySelectorAll('.qs-color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === colorName);
    });
    document.getElementById('qs-colors').classList.remove('qs-shake');
  };

  // ============================================
  // QUANTITY CONTROLS
  // ============================================
  function updateQty(delta) {
    QS.quantity = Math.max(1, QS.quantity + delta);
    document.getElementById('qs-qty-val').textContent = QS.quantity;
  }

  // ============================================
  // CONFIRM — ADD TO CART
  // ============================================
  function confirmAddToCart() {
    const hasColors = document.getElementById('qs-color-section').style.display !== 'none';

    // Validate size
    if (!QS.selectedSize) {
      const el = document.getElementById('qs-sizes');
      el.classList.add('qs-shake');
      setTimeout(() => el.classList.remove('qs-shake'), 500);
      showToast('Por favor selecciona una talla');
      return;
    }

    // Validate color (only if product has colors)
    if (hasColors && !QS.selectedColor) {
      const el = document.getElementById('qs-colors');
      el.classList.add('qs-shake');
      setTimeout(() => el.classList.remove('qs-shake'), 500);
      showToast('Por favor selecciona un color');
      return;
    }

    // Build display size string (include color if selected)
    let sizeDisplay = QS.selectedSize;
    if (QS.selectedColor) {
      sizeDisplay = `${QS.selectedSize} / ${QS.selectedColor}`;
    }

    // Add to cart
    Cart.addItem(QS.productId, sizeDisplay, QS.quantity);

    // Close modal and open cart
    closeQuickSelect();
    setTimeout(() => openCart(), 200);
  }

  // ============================================
  // EXPOSE GLOBALLY
  // ============================================
  window.openQuickSelect  = openQuickSelect;
  window.closeQuickSelect = closeQuickSelect;

  // ============================================
  // INIT EVENT LISTENERS
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    // Overlay click
    const overlay = document.getElementById('qs-overlay');
    if (overlay) overlay.addEventListener('click', closeQuickSelect);

    // Close button
    const closeBtn = document.getElementById('qs-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeQuickSelect);

    // Confirm button
    const confirmBtn = document.getElementById('qs-confirm-btn');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmAddToCart);

    // Qty buttons
    const minusBtn = document.getElementById('qs-qty-minus');
    const plusBtn  = document.getElementById('qs-qty-plus');
    if (minusBtn) minusBtn.addEventListener('click', () => updateQty(-1));
    if (plusBtn)  plusBtn.addEventListener('click',  () => updateQty(1));

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeQuickSelect();
    });
  });

})();

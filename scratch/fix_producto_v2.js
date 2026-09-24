const fs = require('fs');

let html = fs.readFileSync('producto.html', 'utf8');

// 1. Replace size, color, actions section
const oldSectionRegex = /<!-- Size Selector -->[\s\S]*?<!-- Related Products -->/;
const newSection = `<!-- Size Selector -->
          <div class="size-selector" style="margin-bottom: 1.75rem;">
            <div class="size-selector-label" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; text-transform: uppercase; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.15em; color: var(--color-text-secondary);">
              <span>Talla</span>
              <a href="#" onclick="document.getElementById('size-guide-modal').style.display='flex'; return false;" style="color: #111; text-decoration: none; border-bottom: 1px solid #111; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.1em;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> GUÍA DE TALLAS</a>
            </div>
            <div class="size-grid" id="size-grid"></div>
          </div>

          <!-- Color Selector -->
          <div class="color-selector" id="color-selector-wrap" style="display:none; margin-bottom: 1.75rem;">
            <div class="size-selector-label" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; text-transform: uppercase; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.15em; color: var(--color-text-secondary);">
              <span>Color</span>
              <span id="selected-color-display" style="color: #111; font-weight: 600; text-transform: none; font-size: 0.8rem; letter-spacing: normal;"></span>
            </div>
            <div class="color-swatches" id="color-swatches"></div>
          </div>

          <!-- Action Buttons -->
          <div class="product-actions" style="display: grid !important; grid-template-columns: 1fr 54px !important; gap: 12px !important; margin-top: 2rem !important; align-items: stretch !important;">
            <button class="btn" id="add-to-cart-btn" style="height: 54px; background: #000; color: #fff; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.75rem; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; transition: background 0.2s ease;">
              Añadir a la bolsa
            </button>
            <button class="btn-heart" id="product-wishlist-btn" aria-label="Añadir a favoritos">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Related Products -->`;

if (!oldSectionRegex.test(html)) {
  console.error('Failed to match oldSectionRegex');
  process.exit(1);
}

html = html.replace(oldSectionRegex, newSection);

// 2. Replace script and modal
const scriptRegex = /<script>[\s\S]*?<\/script>\s*<!-- Size Guide Modal -->[\s\S]*?<\/html>/;

const newScriptAndModal = `<script>
(function() {
  let selectedSize = null;
  let selectedColor = null;
  let quantity = 1;
  let currentProduct = null;

  function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
      document.querySelector('.product-detail').innerHTML = '<div style="padding:10rem 0;text-align:center">Producto no encontrado.</div>';
      return;
    }

    const p = getProductBySlug(id);
    if (!p) {
      document.querySelector('.product-detail').innerHTML = '<div style="padding:10rem 0;text-align:center">Producto no encontrado.</div>';
      return;
    }

    currentProduct = p;
    document.title = p.name + ' — Luxury Boutique';

    // WA Button setup
    const waMessage = \`Hola, estoy interesada en este producto de Luxury Boutique: *\${p.name}*. Quisiera consultar disponibilidad y tallas.\`;
    const waBtn = document.getElementById('wa-consult-btn');
    if (waBtn) waBtn.href = \`https://wa.me/\${CONFIG.whatsappNumber}?text=\${encodeURIComponent(waMessage)}\`;

    // Update Recent History
    addRecentlyViewed(p.slug);

    renderProduct(p);
    renderRelated(p);
    renderRecentlyViewed(p);
  }

  function createProductCardHTML(p) {
    const stock  = getStockLabel(p);
    const hasTwo = p.images.length > 1;
    const isOut  = p.stock === 0;

    return \`
      <article class="product-card\${isOut ? ' out-of-stock' : ''}">
        <div class="card-image-wrap\${hasTwo ? ' has-hover-img' : ''}">
          <img class="card-img-main" src="\${p.images[0]}" alt="\${p.name}" loading="lazy">
          \${hasTwo ? \`<img class="card-img-hover" src="\${p.images[1]}" alt="\${p.name} vista 2" loading="lazy">\` : ''}
          \${p.isNew ? '<span class="card-badge">Nuevo</span>' : ''}
          \${isOut ? '<span class="card-badge out">Agotado</span>' : ''}
          <div class="card-actions">
            \${isOut 
              ? \`<button class="btn btn-outline-dark btn-full" disabled style="opacity:.5;cursor:not-allowed">Agotado</button>\`
              : \`<button class="btn btn-primary btn-full" onclick="event.stopPropagation(); openQuickSelect('\${p.id}')">Agregar al Carrito</button>\`
            }
          </div>
          <button class="card-wishlist" aria-label="Favoritos"><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        </div>
        <div class="card-body">
          <p class="card-category">\${p.categoryLabel}</p>
          <h3 class="card-name" style="font-size:1rem"><a href="producto.html?id=\${p.slug}" style="text-decoration:none;color:inherit">\${p.name}</a></h3>
          <div class="card-meta">
            <span class="card-price">\${formatPrice(p.price)}</span>
            <span class="stock-badge \${stock.class === 'out' ? 'out' : stock.class === 'low' ? 'low' : ''}">\${stock.label}</span>
          </div>
        </div>
      </article>
    \`;
  }

  function renderRelated(p) {
    const related = getRelatedProducts(p, 4);
    if (related.length > 0) {
      document.getElementById('related-section').style.display = 'block';
      document.getElementById('related-grid').innerHTML = related.map(createProductCardHTML).join('');
    }
  }

  function renderRecentlyViewed(p) {
    const history = getRecentlyViewedProducts(p.slug);
    if (history.length > 0) {
      document.getElementById('recently-viewed-section').style.display = 'block';
      document.getElementById('recently-viewed-grid').innerHTML = history.map(createProductCardHTML).join('');
    }
  }

  function renderProduct(p) {
    document.getElementById('product-content').style.display = 'block';
    document.getElementById('page-title').textContent = \`\${p.name} — Luxury Boutique\`;
    document.getElementById('page-desc').content = p.description;
    document.getElementById('product-breadcrumb-name').textContent = p.name;
    const pcLabel = document.getElementById('product-category-label');
    if (pcLabel) pcLabel.textContent = p.categoryLabel;
    document.getElementById('product-name').textContent = p.name;
    document.getElementById('product-price').textContent = formatPrice(p.price);
    const pDesc = document.getElementById('product-desc');
    if (pDesc) pDesc.textContent = p.description;

    // Stock
    const stockInfo = getStockLabel(p);
    document.getElementById('product-stock').innerHTML = \`<span class="stock-badge \${stockInfo.class === 'low' ? 'low' : ''}">\${stockInfo.label}</span>\`;

    // Main image
    const mainImg = document.getElementById('gallery-main-img');
    mainImg.src = p.images[0];
    mainImg.alt = p.name;

    // Thumbs
    const thumbsContainer = document.getElementById('gallery-thumbs');
    thumbsContainer.innerHTML = p.images.map((img, i) => \`
      <div class="gallery-thumb \${i === 0 ? 'active' : ''}" data-idx="\${i}" onclick="changeImage(\${i})">
        <img src="\${img}" alt="\${p.name} foto \${i+1}" loading="lazy">
      </div>
    \`).join('');

    // Sizes
    const sizeGrid = document.getElementById('size-grid');
    sizeGrid.innerHTML = p.sizes.map(size => \`
      <button class="size-btn" data-size="\${size}" onclick="selectSize('\${size}')">\${size}</button>
    \`).join('');

    // Colors
    const colorWrap = document.getElementById('color-selector-wrap');
    const colorSwatches = document.getElementById('color-swatches');
    const colorDisp = document.getElementById('selected-color-display');
    if (colorDisp) colorDisp.textContent = '';

    if (p.colors && p.colors.length > 0) {
      colorWrap.style.display = 'block';
      colorSwatches.innerHTML = p.colors.map(color => \`
        <button
          class="color-swatch-btn"
          data-color="\${color.name}"
          onclick="selectColor('\${color.name}')"
          title="\${color.name}"
        >
          <span class="color-swatch-circle" style="background:\${color.hex}"></span>
          \${color.name}
        </button>
      \`).join('');
    } else {
      colorWrap.style.display = 'none';
    }

    // Wishlist button state
    const heartBtn = document.getElementById('product-wishlist-btn');
    if (heartBtn && typeof Wishlist !== 'undefined') {
      heartBtn.classList.toggle('favorited', Wishlist.has(p.id));
    }

    // Add to cart
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
      const hasColors = currentProduct.colors && currentProduct.colors.length > 0;
      if (!selectedSize) {
        showToast('Por favor selecciona una talla');
        return;
      }
      if (hasColors && !selectedColor) {
        showToast('Por favor selecciona un color');
        return;
      }
      const sizeLabel = selectedColor ? \`\${selectedSize} — \${selectedColor}\` : selectedSize;
      Cart.addItem(p.id, sizeLabel, quantity);
      openCart();
    });

    // Wishlist button click
    if (heartBtn) {
      heartBtn.addEventListener('click', () => {
        if (!currentProduct || typeof Wishlist === 'undefined') return;
        const added = Wishlist.toggle(currentProduct.id);
        heartBtn.classList.toggle('favorited', added);
        showToast(added ? 'Agregado a tus favoritos' : 'Eliminado de tus favoritos');
      });
    }
  }

  window.selectSize = function(size) {
    selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.size === size);
    });
  };

  window.selectColor = function(colorName) {
    selectedColor = colorName;
    const disp = document.getElementById('selected-color-display');
    if (disp) disp.textContent = colorName;
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.color === colorName);
    });
  };

  window.changeImage = function(idx) {
    const mainImg = document.getElementById('gallery-main-img');
    if (!currentProduct || !currentProduct.images[idx]) return;
    mainImg.src = currentProduct.images[idx];
    document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === idx);
    });
  };

  document.addEventListener('DOMContentLoaded', init);
})();
</script>

<!-- Size Guide Modal -->
<div id="size-guide-modal" onclick="if(event.target===this) this.style.display='none'" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(5px); z-index:9999; align-items:center; justify-content:center; padding:1.25rem;">
  <div style="background:#ffffff; width:100%; max-width:540px; position:relative; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border:1px solid #eee; padding:2.5rem 2rem; max-height:90vh; overflow-y:auto;">
    <button onclick="document.getElementById('size-guide-modal').style.display='none'" aria-label="Cerrar" style="position:absolute; right:1.5rem; top:1.5rem; background:none; border:none; font-size:1.75rem; line-height:1; cursor:pointer; color:#777; transition:color 0.2s;" onmouseover="this.style.color='#000'" onmouseout="this.style.color='#777'">&times;</button>
    
    <div style="text-align:center; margin-bottom:2rem;">
      <p style="font-family:var(--font-sans); font-size:0.7rem; font-weight:600; letter-spacing:0.2em; text-transform:uppercase; color:#999; margin-bottom:0.4rem;">Luxury Boutique</p>
      <h2 style="font-family:var(--font-serif); font-size:2rem; font-weight:400; color:#111; margin:0 0 0.5rem 0;">Guía de Tallas</h2>
      <p style="font-family:var(--font-sans); font-size:0.85rem; color:#666; margin:0;">Medidas corporales de referencia expresadas en centímetros (cm).</p>
    </div>

    <!-- Table -->
    <div style="overflow-x:auto; margin-bottom:2rem;">
      <table style="width:100%; border-collapse:collapse; text-align:center; font-family:var(--font-sans); font-size:0.85rem;">
        <thead>
          <tr style="background:#f8f8f8; border-bottom:1.5px solid #111;">
            <th style="padding:0.85rem 0.5rem; font-weight:600; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:#111;">Talla</th>
            <th style="padding:0.85rem 0.5rem; font-weight:600; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:#111;">Busto (cm)</th>
            <th style="padding:0.85rem 0.5rem; font-weight:600; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:#111;">Cintura (cm)</th>
            <th style="padding:0.85rem 0.5rem; font-weight:600; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:#111;">Cadera (cm)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:0.85rem 0.5rem; font-weight:600; color:#111;">XS</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">82 - 86</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">62 - 66</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">86 - 90</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0; background:#fdfdfd;">
            <td style="padding:0.85rem 0.5rem; font-weight:600; color:#111;">S</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">86 - 90</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">66 - 70</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">90 - 94</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:0.85rem 0.5rem; font-weight:600; color:#111;">M</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">90 - 94</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">70 - 74</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">94 - 98</td>
          </tr>
          <tr style="border-bottom:1px solid #f0f0f0; background:#fdfdfd;">
            <td style="padding:0.85rem 0.5rem; font-weight:600; color:#111;">L</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">94 - 100</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">74 - 80</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">98 - 104</td>
          </tr>
          <tr style="border-bottom:1px solid #111;">
            <td style="padding:0.85rem 0.5rem; font-weight:600; color:#111;">XL</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">100 - 106</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">80 - 86</td>
            <td style="padding:0.85rem 0.5rem; color:#555;">104 - 110</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- How to measure -->
    <div style="background:#fafafa; border:1px solid #eee; padding:1.25rem; margin-bottom:1.5rem;">
      <h4 style="font-family:var(--font-sans); font-size:0.75rem; font-weight:600; letter-spacing:0.15em; text-transform:uppercase; color:#111; margin-bottom:0.75rem;">¿Cómo tomar tus medidas?</h4>
      <div style="display:flex; flex-direction:column; gap:0.6rem; font-family:var(--font-sans); font-size:0.8rem; color:#555; line-height:1.4;">
        <div><strong>1. Busto:</strong> Mide alrededor de la parte más llena del busto manteniendo la cinta horizontal.</div>
        <div><strong>2. Cintura:</strong> Mide la parte más estrecha de la cintura, por encima del ombligo.</div>
        <div><strong>3. Cadera:</strong> Con los pies juntos, mide alrededor de la parte más ancha de la cadera.</div>
      </div>
    </div>

    <p style="font-family:var(--font-sans); font-size:0.75rem; color:#888; text-align:center; margin:0; line-height:1.5;">
      💡 Si estás entre dos tallas, te sugerimos elegir la talla superior para mayor comodidad.
    </p>
  </div>
</div>
</body>
</html>`;

if (!scriptRegex.test(html)) {
  console.error('Failed to match scriptRegex');
  process.exit(1);
}

html = html.replace(scriptRegex, newScriptAndModal);

fs.writeFileSync('producto.html', html, 'utf8');
console.log('Successfully updated producto.html!');

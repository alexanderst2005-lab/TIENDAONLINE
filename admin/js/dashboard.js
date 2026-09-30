document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return; // Guard logic handled in index.html

  // Format currency
  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  // Navegación SPA
  const navItems = document.querySelectorAll('.nav-item');
  const pageViews = document.querySelectorAll('.page-view');
  const pageTitle = document.getElementById('pageTitle');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = item.getAttribute('data-page');
      
      // Update UI
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      pageTitle.textContent = item.textContent.trim();
      
      // Show View
      pageViews.forEach(view => {
        if (view.id === 'view-' + pageId) {
          view.style.display = 'block';
        } else {
          view.style.display = 'none';
        }
      });

      // Load specific data
      if (pageId === 'dashboard') loadDashboard();
      if (pageId === 'products') loadProducts();
      if (pageId === 'inventory') loadInventory();
      if (pageId === 'orders') loadOrders();
      if (pageId === 'categories') loadCategories();
      if (pageId === 'collections') loadCollections();
      if (pageId === 'customers') loadCustomers();
    });
  });

  async function loadDashboard() {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error fetching dashboard data');
      const data = await response.json();

      document.getElementById('statsSalesToday').textContent = formatCurrency(data.salesToday);
      document.getElementById('statsPendingOrders').textContent = data.pendingOrders;
      document.getElementById('statsActiveProducts').textContent = data.activeProducts;
      document.getElementById('statsLowStock').textContent = data.lowStockProducts;

      const tableBody = document.getElementById('recentOrdersTableBody');
      tableBody.innerHTML = '';
      if (data.recentOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay pedidos recientes</td></tr>';
      } else {
        data.recentOrders.forEach(order => {
          const tr = document.createElement('tr');
          const date = new Date(order.createdAt).toLocaleDateString();
          let badgeClass = 'warning';
          if (order.status === 'Confirmado' || order.status === 'En preparación') badgeClass = 'success';
          if (order.status === 'Cancelado') badgeClass = 'error';
          tr.innerHTML = `
            <td>#${order.orderNumber}</td>
            <td>${order.customerName}</td>
            <td>${date}</td>
            <td>${formatCurrency(order.total)}</td>
            <td><span class="status-badge ${badgeClass}">${order.status}</span></td>
          `;
          tableBody.appendChild(tr);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  window.productsList = [];

  async function loadProducts() {
    try {
      const response = await fetch('/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      window.productsList = data; // Cache
      
      const tbody = document.getElementById('productsTableBody');
      tbody.innerHTML = '';
      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay productos</td></tr>';
        return;
      }
      data.forEach(p => {
        const tr = document.createElement('tr');
        let imgSrc = p.images && p.images[0] ? p.images[0] : '';
        if (imgSrc && !imgSrc.startsWith('data:') && !imgSrc.startsWith('http')) {
          imgSrc = '../' + imgSrc;
        }
        const img = imgSrc ? `<img src="${imgSrc}" width="40" height="40" style="border-radius:4px; object-fit:cover;">` : 'N/A';
        const statusClass = p.isActive ? 'success' : 'error';
        const statusText = p.isActive ? 'Activo' : 'Oculto';
        tr.innerHTML = `
          <td>${img}</td>
          <td>${p.name}</td>
          <td>${formatCurrency(p.price)}</td>
          <td>${p.stock > 0 ? '<span style="color:#2ecc71;font-weight:600;">Disponible</span>' : '<span style="color:#e74c3c;font-weight:600;">Agotado</span>'}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
            <button class="btn-edit" onclick="openProductModal('${p.id}')">Editar</button>
            <button class="btn-delete" onclick="deleteProduct('${p.id}')">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch(err) {
      console.error(err);
    }
  }

  async function loadInventory() {
    try {
      const response = await fetch('/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      const tbody = document.getElementById('inventoryTableBody');
      tbody.innerHTML = '';
      data.forEach(p => {
        const tr = document.createElement('tr');
        let status = p.stock > 0 ? 'Disponible' : 'Agotado';
        let statusClass = p.stock > 0 ? 'success' : 'error';

        tr.innerHTML = `
          <td>${p.name}</td>
          <td>General</td>
          <td>General</td>
          <td>
            <select id="stock-${p.id}" style="width: 100px; padding: 5px;">
              <option value="1" ${p.stock > 0 ? 'selected' : ''}>Disponible</option>
              <option value="0" ${p.stock <= 0 ? 'selected' : ''}>Agotado</option>
            </select>
          </td>
          <td><span class="status-badge ${statusClass}">${status}</span></td>
          <td><button class="btn-primary" style="padding: 5px 10px;" onclick="updateStock('${p.id}')">Actualizar</button></td>
        `;
        tbody.appendChild(tr);
      });
    } catch(err) { console.error(err); }
  }
  
  async function loadOrders() {
    try {
      const response = await fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      const tbody = document.getElementById('ordersTableBody');
      tbody.innerHTML = '';
      if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay pedidos</td></tr>';
        return;
      }
      data.forEach(o => {
        const tr = document.createElement('tr');
        const date = new Date(o.createdAt).toLocaleDateString();
        const selectHtml = `
          <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding: 4px; border-radius: 4px; border: 1px solid var(--border);">
            <option value="Pendiente" ${o.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="Confirmado" ${o.status === 'Confirmado' ? 'selected' : ''}>Confirmado</option>
            <option value="En preparación" ${o.status === 'En preparación' ? 'selected' : ''}>En preparación</option>
            <option value="Enviado" ${o.status === 'Enviado' ? 'selected' : ''}>Enviado</option>
            <option value="Entregado" ${o.status === 'Entregado' ? 'selected' : ''}>Entregado</option>
            <option value="Cancelado" ${o.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        `;

        tr.innerHTML = `
          <td>#${o.orderNumber}</td>
          <td>${date}</td>
          <td>${o.customerName}</td>
          <td>${formatCurrency(o.total)}</td>
          <td>${selectHtml}</td>
          <td>
            <button class="btn-edit" onclick="viewOrder('${o.id}')">Ver detalle</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch(err) { console.error(err); }
  }

  function loadCategories() {
    const tbody = document.getElementById('categoriesTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Módulo en construcción (Próximamente)</td></tr>';
  }

  function loadCollections() {
    const tbody = document.getElementById('collectionsTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Módulo en construcción (Próximamente)</td></tr>';
  }

  function loadCustomers() {
    const tbody = document.getElementById('customersTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Módulo en construcción (Próximamente)</td></tr>';
  }

  window.updateOrderStatus = async function(id, newStatus) {
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: parseInt(id, 10), status: newStatus })
      });
      alert('Estado del pedido actualizado a: ' + newStatus);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el pedido');
      loadOrders(); // reload to reset state
    }
  }

  window.viewOrder = function(id) {
    alert('Función para ver detalles del pedido ' + id + ' en construcción.');
  }

  // --- Modal Logic ---
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');

  let currentImages = [];

  function renderGallery() {
    const gallery = document.getElementById('imageGallery');
    gallery.innerHTML = '';
    currentImages.forEach((imgSrc, index) => {
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.width = '80px';
      container.style.height = '80px';
      container.style.borderRadius = '6px';
      container.style.overflow = 'hidden';
      container.style.border = '1px solid #ccc';
      
      const img = document.createElement('img');
      img.src = imgSrc.startsWith('data:') || imgSrc.startsWith('http') ? imgSrc : `../${imgSrc}`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      
      const btnRemove = document.createElement('button');
      btnRemove.innerHTML = '&times;';
      btnRemove.style.position = 'absolute';
      btnRemove.style.top = '2px';
      btnRemove.style.right = '2px';
      btnRemove.style.background = 'rgba(0,0,0,0.6)';
      btnRemove.style.color = 'white';
      btnRemove.style.border = 'none';
      btnRemove.style.borderRadius = '50%';
      btnRemove.style.width = '20px';
      btnRemove.style.height = '20px';
      btnRemove.style.cursor = 'pointer';
      btnRemove.style.display = 'flex';
      btnRemove.style.alignItems = 'center';
      btnRemove.style.justifyContent = 'center';
      btnRemove.onclick = (e) => {
        e.preventDefault();
        currentImages.splice(index, 1);
        renderGallery();
      };

      container.appendChild(img);
      container.appendChild(btnRemove);
      gallery.appendChild(container);
    });
  }

  const imageInput = document.getElementById('prodImageInput');
  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentImages.push(ev.target.result);
          renderGallery();
        };
        reader.readAsDataURL(file);
      });
      imageInput.value = ''; // Reset input
    });
  }

  window.openProductModal = function(id = null) {
    if (id) {
      document.getElementById('modalTitle').textContent = 'Editar Producto';
      const p = window.productsList.find(x => x.id === id);
      if (p) {
        document.getElementById('prodId').value = p.id;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodComparePrice').value = p.compareAtPrice || '';
        document.getElementById('prodStock').value = p.stock > 0 ? "1" : "0";
        document.getElementById('prodCategory').value = p.category;
        document.getElementById('prodCollection').value = p.collectionId ? p.collectionId : '';
        document.getElementById('prodSizes').value = p.sizes ? p.sizes.join(', ') : '';
        document.getElementById('prodColors').value = p.colors ? p.colors.map(c => c.name).join(', ') : '';
        document.getElementById('prodIsNew').checked = !!p.isNew;
        document.getElementById('prodIsFeatured').checked = !!p.isFeatured;
        document.getElementById('prodDesc').value = p.description;
        document.getElementById('prodActive').checked = p.isActive;
        currentImages = [...(p.images || [])];
      }
    } else {
      document.getElementById('modalTitle').textContent = 'Agregar Producto';
      form.reset();
      document.getElementById('prodId').value = '';
      document.getElementById('prodActive').checked = true;
      document.getElementById('prodIsNew').checked = false;
      document.getElementById('prodIsFeatured').checked = false;
      currentImages = [];
    }
    renderGallery();
    modal.style.display = 'flex';
  }

  window.closeProductModal = function() {
    modal.style.display = 'none';
  }

  document.getElementById('btnAddProduct').addEventListener('click', () => {
    openProductModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prodId').value;
    const method = id ? 'PUT' : 'POST';
    
    const saveBtn = document.getElementById('btnSaveProduct');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Guardando...';
    saveBtn.disabled = true;

    const rawSizes = document.getElementById('prodSizes').value;
    const sizesArr = rawSizes ? rawSizes.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    // Mapa de colores comunes a códigos HEX para los círculos de la tienda
    const colorMap = {
      'blanco': '#ffffff', 'negro': '#000000', 'rojo': '#ff0000', 'azul': '#0000ff',
      'verde': '#008000', 'amarillo': '#ffff00', 'rosa': '#ffc0cb', 'rosado': '#ffc0cb',
      'morado': '#800080', 'gris': '#808080', 'beige': '#f5f5dc', 'naranja': '#ffa500',
      'cafe': '#8b4513', 'café': '#8b4513', 'marrón': '#8b4513', 'marron': '#8b4513',
      'celeste': '#87ceeb', 'fucsia': '#ff00ff', 'vino': '#722f37', 'lila': '#c8a2c8',
      'mostaza': '#ffdb58', 'dorado': '#ffd700', 'plateado': '#c0c0c0', 'oliva': '#808000',
      'turquesa': '#40e0d0', 'marfil': '#fffff0', 'crema': '#fffdd0', 'coral': '#ff7f50'
    };

    const rawColors = document.getElementById('prodColors').value;
    const colorsArr = rawColors ? rawColors.split(',').map(c => {
      const name = c.trim();
      const hex = colorMap[name.toLowerCase()] || '#cccccc'; // Gris por defecto si no lo encuentra
      return { name, hex };
    }).filter(c => c.name) : [];
    
    const rawComparePrice = document.getElementById('prodComparePrice').value;

    const payload = {
      id: id || undefined,
      name: document.getElementById('prodName').value,
      price: document.getElementById('prodPrice').value,
      compareAtPrice: rawComparePrice ? parseInt(rawComparePrice, 10) : null,
      stock: parseInt(document.getElementById('prodStock').value, 10),
      category: document.getElementById('prodCategory').value,
      categoryLabel: document.getElementById('prodCategory').options[document.getElementById('prodCategory').selectedIndex].text,
      sizes: sizesArr,
      colors: colorsArr,
      isNew: document.getElementById('prodIsNew').checked,
      isFeatured: document.getElementById('prodIsFeatured').checked,
      description: document.getElementById('prodDesc').value,
      isActive: document.getElementById('prodActive').checked,
      images: currentImages.length > 0 ? currentImages : ['images/placeholder.jpg']
    };

    try {
      await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      closeProductModal();
      loadProducts(); // Reload
    } catch (err) {
      console.error(err);
      alert('Error guardando el producto');
    } finally {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }
  });

  window.deleteProduct = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      loadProducts();
    } catch(err) { console.error(err); }
  }

  window.updateStock = async function(id) {
    const newStock = document.getElementById(`stock-${id}`).value;
    try {
      // Small PUT trick to just update stock (requires passing minimal fields to our simple API or a dedicated endpoint. 
      // For now we will fetch, patch, and save).
      const p = window.productsList.find(x => x.id === id);
      p.stock = parseInt(newStock, 10);
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(p)
      });
      loadInventory();
      alert('Stock actualizado');
    } catch(err) { console.error(err); }
  }

  // Initial Load
  loadDashboard();
});

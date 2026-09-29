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
        const img = p.images && p.images[0] ? `<img src="../${p.images[0]}" width="40" style="border-radius:4px">` : 'N/A';
        const statusClass = p.isActive ? 'success' : 'error';
        const statusText = p.isActive ? 'Activo' : 'Oculto';
        tr.innerHTML = `
          <td>${img}</td>
          <td>${p.name}</td>
          <td>${formatCurrency(p.price)}</td>
          <td>${p.stock}</td>
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
        let status = 'Disponible';
        let statusClass = 'success';
        if (p.stock <= 0) { status = 'Agotado'; statusClass = 'error'; }
        else if (p.stock < 5) { status = 'Poco stock'; statusClass = 'warning'; }

        tr.innerHTML = `
          <td>${p.name}</td>
          <td>General</td>
          <td>General</td>
          <td>
            <input type="number" value="${p.stock}" id="stock-${p.id}" style="width: 60px; padding: 5px;">
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
        tr.innerHTML = `
          <td>#${o.orderNumber}</td>
          <td>${date}</td>
          <td>${o.customerName}</td>
          <td>${formatCurrency(o.total)}</td>
          <td>${o.status}</td>
          <td><button class="btn-edit" onclick="viewOrder('${o.id}')">Ver detalle</button></td>
        `;
        tbody.appendChild(tr);
      });
    } catch(err) { console.error(err); }
  }

  // --- Modal Logic ---
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');

  window.openProductModal = function(id = null) {
    if (id) {
      document.getElementById('modalTitle').textContent = 'Editar Producto';
      const p = window.productsList.find(x => x.id === id);
      if (p) {
        document.getElementById('prodId').value = p.id;
        document.getElementById('prodName').value = p.name;
        document.getElementById('prodPrice').value = p.price;
        document.getElementById('prodStock').value = p.stock;
        document.getElementById('prodCategory').value = p.category;
        document.getElementById('prodDesc').value = p.description;
        document.getElementById('prodActive').checked = p.isActive;
      }
    } else {
      document.getElementById('modalTitle').textContent = 'Agregar Producto';
      form.reset();
      document.getElementById('prodId').value = '';
      document.getElementById('prodActive').checked = true;
    }
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
    const payload = {
      id: id || undefined,
      name: document.getElementById('prodName').value,
      price: document.getElementById('prodPrice').value,
      stock: document.getElementById('prodStock').value,
      category: document.getElementById('prodCategory').value,
      categoryLabel: document.getElementById('prodCategory').options[document.getElementById('prodCategory').selectedIndex].text,
      description: document.getElementById('prodDesc').value,
      isActive: document.getElementById('prodActive').checked,
      images: ['images/placeholder.jpg'] // Hardcoded demo fallback
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
      p.stock = newStock;
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

/* ============================================
   TIENDA ONLINE — WHATSAPP.JS
   Generador de mensaje de pedido para WhatsApp
   ============================================ */

'use strict';

// ============================================
// GENERAR MENSAJE DE WHATSAPP
// ============================================
function buildWhatsAppMessage(customerData, cartItems) {
  const lines = [];

  lines.push('Hola, quiero realizar el siguiente pedido:');
  lines.push('');
  lines.push('🛍️ *PRODUCTOS:*');

  cartItems.forEach(item => {
    const subtotal = item.price * item.quantity;
    lines.push(
      `• ${item.name} — Talla ${item.size} — Cantidad: ${item.quantity} — ${formatPrice(subtotal)}`
    );
  });

  lines.push('');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  lines.push(`*TOTAL: ${formatPrice(total)}*`);
  lines.push('');
  lines.push('👤 *DATOS DEL CLIENTE:*');
  lines.push(`Nombre: ${customerData.name}`);
  lines.push(`Teléfono: ${customerData.phone}`);
  lines.push(`Ciudad: ${customerData.city}`);
  lines.push(`Dirección: ${customerData.address}`);
  if (customerData.payment_method) {
    lines.push(`Método de Pago: ${customerData.payment_method}`);
  }

  if (customerData.notes && customerData.notes.trim()) {
    lines.push('');
    lines.push(`📝 *Notas:*`);
    lines.push(customerData.notes.trim());
  }

  return lines.join('\n');
}

// ============================================
// ENVIAR PEDIDO POR WHATSAPP
// ============================================
function sendOrderToWhatsApp(customerData) {
  const cartItems = Cart.get();

  if (cartItems.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de realizar un pedido.');
    return;
  }

  const message  = buildWhatsAppMessage(customerData, cartItems);
  const encoded  = encodeURIComponent(message);
  const waNumber = CONFIG.whatsappNumber;
  const waUrl    = `https://wa.me/${waNumber}?text=${encoded}`;

  // Open WhatsApp
  window.open(waUrl, '_blank');
}

// ============================================
// CHECKOUT FORM HANDLER
// ============================================
function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  // Render order summary
  renderOrderSummary();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const customerData = {
      name:    form.querySelector('#customer-name').value.trim(),
      phone:   form.querySelector('#customer-phone').value.trim(),
      city:    form.querySelector('#customer-city').value.trim(),
      address: form.querySelector('#customer-address').value.trim(),
      notes:   form.querySelector('#customer-notes').value.trim(),
      payment_method: form.querySelector('input[name="payment_method"]:checked')?.value || 'Contra Entrega'
    };

    // Basic validation
    if (!customerData.name || !customerData.phone || !customerData.city || !customerData.address) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const items = Cart.get();
    if (items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const submitBtn = document.getElementById('whatsapp-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'PROCESANDO...';
    }

    try {
      const subtotal = Cart.getSubtotal();
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerData,
          items,
          subtotal,
          total: subtotal // assuming no shipping cost yet
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error creando pedido');

      // Clear cart because order is already created in DB
      Cart.clear();

      if (customerData.payment_method === 'Pago en Línea') {
        // Redirect to test payment gateway
        window.location.href = `pay.html?order=${data.orderNumber}&total=${subtotal}`;
        return;
      }

      // Add order number to notes for whatsapp
      customerData.notes = (customerData.notes ? customerData.notes + '\n\n' : '') + 'Número de pedido web: ' + data.orderNumber;

      sendOrderToWhatsApp(customerData);
      
      // Optionally redirect to a thank you page, but WhatsApp opens in a new tab anyway
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);

    } catch (err) {
      console.error(err);
      alert('Hubo un problema generando tu pedido. Por favor intenta de nuevo.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'ENVIAR PEDIDO POR WHATSAPP';
      }
    }
  });
}

// ============================================
// RENDER ORDER SUMMARY IN CHECKOUT
// ============================================
function renderOrderSummary() {
  const container = document.getElementById('order-summary-items');
  if (!container) return;

  const items = Cart.get();

  if (items.length === 0) {
    container.innerHTML = '<p style="color:var(--color-text-secondary);font-size:0.875rem;">Tu carrito está vacío.</p>';
    return;
  }

  const subtotal = Cart.getSubtotal();

  const itemsHTML = items.map(item => `
    <div class="summary-item">
      <div class="summary-item-left">
        <strong style="color:var(--color-text-primary)">${item.name}</strong><br>
        <span style="font-size:0.75rem">Talla: ${item.size} &nbsp;·&nbsp; Cantidad: ${item.quantity}</span>
      </div>
      <div class="summary-item-right">${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');

  container.innerHTML = `
    ${itemsHTML}
    <div class="summary-total">
      <span class="summary-total-label">Total</span>
      <span class="summary-total-price">${formatPrice(subtotal)}</span>
    </div>
  `;
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initCheckoutForm();
});

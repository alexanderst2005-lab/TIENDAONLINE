/**
 * Brevo (Sendinblue) email service utility.
 * Uses BREVO_API_KEY from environment variables — never hardcoded.
 * Works identically in test (mock payment) and production (real payment gateway).
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const STORE_NAME = 'Monatela Boutique';
const STORE_EMAIL = 'alexanderst2005@gmail.com'; // verified Brevo sender

function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
}

function buildItemsTable(items: any[]): string {
  const rows = items.map(item => {
    const variant = [item.size, item.color].filter(Boolean).join(' / ');
    return `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;vertical-align:middle;">
          <strong>${item.productName}</strong>
          ${variant ? `<br><span style="color:#888;font-size:13px;">${variant}</span>` : ''}
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:center;vertical-align:middle;">${item.quantity}</td>
        <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:right;vertical-align:middle;">${formatCOP(item.price * item.quantity)}</td>
      </tr>`;
  }).join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse;">
      <thead>
        <tr style="background:#f9f9f9;">
          <th style="padding:10px 8px;text-align:left;color:#666;font-weight:600;font-size:12px;text-transform:uppercase;border-bottom:2px solid #eee;">Producto</th>
          <th style="padding:10px 8px;text-align:center;color:#666;font-weight:600;font-size:12px;text-transform:uppercase;border-bottom:2px solid #eee;">Cant.</th>
          <th style="padding:10px 8px;text-align:right;color:#666;font-weight:600;font-size:12px;text-transform:uppercase;border-bottom:2px solid #eee;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#111111;padding:30px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:2px;">${STORE_NAME}</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;letter-spacing:1px;">MODA FEMENINA</p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:36px 40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} ${STORE_NAME}. Todos los derechos reservados.</p>
            <p style="margin:6px 0 0;color:#aaa;font-size:12px;">Si tienes dudas, escríbenos por WhatsApp: <a href="https://wa.me/573229148593" style="color:#111;">+57 322 914 8593</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── EMAIL 1: Confirmación de pago ────────────────────────────────────────────
export function buildConfirmationEmail(order: any, items: any[]): { subject: string; html: string } {
  const subject = `✅ Pedido ${order.orderNumber} recibido — ${STORE_NAME}`;
  const itemsTable = buildItemsTable(items);
  const html = emailWrapper(`
    <h2 style="margin:0 0 6px;color:#111;font-size:22px;">¡Hola, ${order.customerName}! 🎉</h2>
    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
      Hemos recibido tu pedido y estamos preparándolo para el envío. Te avisaremos cuando esté en camino.
    </p>

    <!-- Order info box -->
    <div style="background:#f8f8f8;border-radius:8px;padding:20px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#888;padding:4px 0;">N.° de Pedido</td>
          <td style="font-size:14px;font-weight:700;color:#111;text-align:right;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#888;padding:4px 0;">Fecha</td>
          <td style="font-size:14px;color:#555;text-align:right;">${new Date(order.createdAt).toLocaleString('es-CO')}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#888;padding:4px 0;">Método de pago</td>
          <td style="font-size:14px;color:#555;text-align:right;">${order.paymentMethod || 'N/A'}</td>
        </tr>
      </table>
    </div>

    <!-- Items -->
    <h3 style="margin:0 0 16px;color:#111;font-size:16px;">Productos</h3>
    ${itemsTable}

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Subtotal</td>
        <td style="padding:6px 0;font-size:14px;color:#555;text-align:right;">${formatCOP(order.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#666;">Envío</td>
        <td style="padding:6px 0;font-size:14px;color:#555;text-align:right;">${order.shipping > 0 ? formatCOP(order.shipping) : 'A calcular'}</td>
      </tr>
      <tr style="border-top:2px solid #111;margin-top:8px;">
        <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#111;">Total pagado</td>
        <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#111;text-align:right;">${formatCOP(order.total)}</td>
      </tr>
    </table>

    <!-- Shipping address -->
    <div style="background:#f0f9f4;border:1px solid #c3e6cb;border-radius:8px;padding:20px;margin-top:28px;">
      <h3 style="margin:0 0 12px;color:#155724;font-size:15px;">📦 Datos de entrega</h3>
      <p style="margin:3px 0;font-size:14px;color:#333;"><strong>Destinatario:</strong> ${order.customerName}</p>
      <p style="margin:3px 0;font-size:14px;color:#333;"><strong>Dirección:</strong> ${order.customerAddress || 'N/A'}</p>
      <p style="margin:3px 0;font-size:14px;color:#333;"><strong>Ciudad:</strong> ${order.customerCity || 'N/A'}</p>
      <p style="margin:3px 0;font-size:14px;color:#333;"><strong>Teléfono:</strong> ${order.customerPhone || 'N/A'}</p>
    </div>

    <p style="margin:28px 0 0;font-size:14px;color:#888;line-height:1.6;">
      Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos. ¡Gracias por confiar en ${STORE_NAME}! 💖
    </p>
  `);
  return { subject, html };
}

// ─── EMAIL 2: Pedido enviado / en camino ──────────────────────────────────────
export function buildShippingEmail(order: any, items: any[]): { subject: string; html: string } {
  const subject = `🚚 Tu pedido ${order.orderNumber} va en camino — ${STORE_NAME}`;
  const itemsTable = buildItemsTable(items);
  const html = emailWrapper(`
    <h2 style="margin:0 0 6px;color:#111;font-size:22px;">¡Hola, ${order.customerName}! 🚀</h2>
    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
      Tu pedido ya va en camino. Puedes utilizar la siguiente información para realizar el seguimiento de tu envío.
    </p>

    <!-- Tracking box -->
    <div style="background:#111;border-radius:10px;padding:24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Transportadora</p>
      <p style="margin:0 0 20px;color:#fff;font-size:20px;font-weight:700;">${order.carrier}</p>
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:1px;">Número de Guía</p>
      <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:2px;">${order.trackingNumber}</p>
    </div>

    <!-- Order summary info -->
    <div style="background:#f8f8f8;border-radius:8px;padding:20px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#888;padding:4px 0;">N.° de Pedido</td>
          <td style="font-size:14px;font-weight:700;color:#111;text-align:right;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#888;padding:4px 0;">Fecha de envío</td>
          <td style="font-size:14px;color:#555;text-align:right;">${order.shippedAt ? new Date(order.shippedAt).toLocaleString('es-CO') : new Date().toLocaleString('es-CO')}</td>
        </tr>
      </table>
    </div>

    <!-- Items -->
    <h3 style="margin:0 0 16px;color:#111;font-size:16px;">Resumen del pedido</h3>
    ${itemsTable}

    <p style="margin:28px 0 0;font-size:14px;color:#888;line-height:1.6;">
      Una vez recibas tu pedido, nos encantaría saber tu opinión. ¡Gracias por elegir ${STORE_NAME}! 💖
    </p>
  `);
  return { subject, html };
}

// ─── Core send function ───────────────────────────────────────────────────────
export async function sendEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string;
  toName: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[Email] BREVO_API_KEY not set — skipping email send.');
    return false;
  }
  if (!to || !to.includes('@')) {
    console.warn('[Email] Invalid recipient email:', to);
    return false;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: STORE_NAME, email: STORE_EMAIL },
        to: [{ email: to, name: toName }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Email] Brevo API error:', err);
      return false;
    }

    console.log(`[Email] Sent "${subject}" to ${to}`);
    return true;
  } catch (err) {
    console.error('[Email] Network error sending email:', err);
    return false;
  }
}

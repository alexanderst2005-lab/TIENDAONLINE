import { db } from '../../db';
import { orders } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, buildConfirmationEmail } from '../_utils/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { action, type, data } = req.body;
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = data?.id || urlParams.get('data.id');
    const topic = type || urlParams.get('type') || urlParams.get('topic');

    // Respond immediately to MP
    res.status(200).send('OK');

    if (topic === 'payment' && id) {
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!accessToken) throw new Error('No access token configured');

      // Fetch payment details
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error('Error fetching MP payment details');
      
      const paymentData = await response.json();
      const orderNumber = paymentData.external_reference;
      
      if (paymentData.status === 'approved') {
        const orderList = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
        if (orderList.length > 0) {
          const order = orderList[0];
          
          if (order.status === 'Pendiente') {
            await db.update(orders)
              .set({ status: 'Preparando' })
              .where(eq(orders.id, order.id));
              
            try {
              const itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
              const html = buildConfirmationEmail(order, itemsList);
              await sendEmail(order.customerEmail, 'Confirmación de Pago - Monatela Boutique', html);
            } catch (e) {
              console.error('Error enviando correo de MP:', e);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[MP Webhook Error]', err);
  }
}

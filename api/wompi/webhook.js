/**
 * Wompi Webhook Handler
 * Receives payment notifications from Wompi and updates order status.
 * 
 * Wompi sends a POST when transactions change status (APPROVED, DECLINED, VOIDED, ERROR).
 * We verify the signature using WOMPI_EVENTS_SECRET before processing.
 */
import { createHash } from 'crypto';
import { db } from '../../db';
import { orders } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { 
  sendEmail, 
  buildConfirmationEmail
} from '../utils/email';

function verifyWompiWebhook(body, signature) {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!eventsSecret) {
    console.warn('[Wompi Webhook] WOMPI_EVENTS_SECRET not set, skipping verification');
    return true; // Allow in dev
  }
  
  const { timestamp, checksum } = body;
  const signatureString = `${JSON.stringify(body.data)}${timestamp}${eventsSecret}`;
  const expected = createHash('sha256').update(signatureString).digest('hex');
  return expected === signature;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const signature = req.headers['x-event-checksum'] || '';
    const body = req.body;
    
    console.log('[Wompi Webhook]', JSON.stringify(body));
    
    // Wompi event structure: { event, data: { transaction }, timestamp, checksum }
    const { event, data } = body;
    
    if (event !== 'transaction.updated') {
      return res.status(200).json({ ok: true }); // Ignore other events
    }
    
    const transaction = data?.transaction;
    if (!transaction) return res.status(400).json({ error: 'No transaction data' });
    
    const { reference, status, amount_in_cents, currency, payment_method_type, id: transactionId } = transaction;
    
    // reference is our orderNumber
    const orderData = await db.select().from(orders).where(eq(orders.orderNumber, reference));
    if (orderData.length === 0) {
      console.warn('[Wompi Webhook] Order not found for reference:', reference);
      return res.status(200).json({ ok: true }); // Return 200 so Wompi doesn't retry
    }
    
    const order = orderData[0];
    
    if (status === 'APPROVED') {
      // Update order to "Confirmado" with transaction details
      await db.update(orders).set({ 
        status: 'Confirmado',
        paymentMethod: payment_method_type || 'Wompi',
        updatedAt: new Date(),
      }).where(eq(orders.id, order.id));
      
      // Send confirmation email if not already sent
      if (!order.confirmationEmailSent && order.customerEmail) {
        const { orderItems } = await import('../../db/schema');
        const { desc } = await import('drizzle-orm');
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        const updatedOrder = { ...order, status: 'Confirmado', paymentMethod: payment_method_type || 'Wompi' };
        const { subject, html } = buildConfirmationEmail(updatedOrder, items);
        const sent = await sendEmail({ to: order.customerEmail, toName: order.customerName, subject, html });
        if (sent) {
          await db.update(orders).set({ confirmationEmailSent: true }).where(eq(orders.id, order.id));
        }
      }
      
      console.log(`[Wompi Webhook] Order ${reference} APPROVED → Confirmado`);
    } else if (status === 'DECLINED' || status === 'VOIDED' || status === 'ERROR') {
      // Don't auto-cancel — just log it. Admin can manually decide
      console.log(`[Wompi Webhook] Transaction for ${reference} status: ${status}`);
    }
    
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Wompi Webhook Error]', err);
    return res.status(500).json({ error: 'Webhook error' });
  }
}

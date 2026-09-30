import { db } from '../../db';
import { orders, orderItems } from '../../db/schema';
import { verifyAuth } from '../_utils/auth';
import { desc, eq } from 'drizzle-orm';
import { 
  sendEmail, 
  buildShippingEmail, 
  buildConfirmationEmail, 
  buildPreparationEmail, 
  buildDeliveredEmail, 
  buildCancelledEmail 
} from '../_utils/email';

export default async function handler(req: any, res: any) {
  try {
    verifyAuth(req);

    if (req.method === 'GET') {
      if (req.query.id) {
        const orderId = Number(req.query.id);
        const orderData = await db.select().from(orders).where(eq(orders.id, orderId));
        if (orderData.length === 0) return res.status(404).json({ error: 'Order not found' });
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
        return res.status(200).json({ ...orderData[0], items });
      }

      const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
      return res.status(200).json(allOrders);
    }

    if (req.method === 'PUT') {
      const { id, status, carrier, trackingNumber } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'Missing ID or status' });

      // Fetch current order
      const orderData = await db.select().from(orders).where(eq(orders.id, id));
      if (orderData.length === 0) return res.status(404).json({ error: 'Order not found' });
      const order = orderData[0];

      if (order.status === status && status !== 'Enviado') {
         // If status hasn't changed and it's not Enviado (which might just be adding tracking), just update updatedAt
         await db.update(orders).set({ updatedAt: new Date() }).where(eq(orders.id, id));
         return res.status(200).json({ message: 'Order updated (no status change)' });
      }

      // Special handling for "Enviado" status — requires tracking info
      if (status === 'Enviado' && (!carrier || !trackingNumber)) {
        return res.status(400).json({
          error: 'Para marcar como Enviado debes proporcionar la transportadora y el número de guía.',
          requiresTracking: true,
        });
      }

      const updateData: any = { status, updatedAt: new Date() };
      if (status === 'Enviado') {
        updateData.carrier = carrier;
        updateData.trackingNumber = trackingNumber;
        updateData.shippedAt = new Date();
      }

      await db.update(orders).set(updateData).where(eq(orders.id, id));
      
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
      const updatedOrder = { ...order, ...updateData };

      if (order.customerEmail) {
        let emailData: { subject: string; html: string } | null = null;
        let updateFlags: any = {};

        if (status === 'Confirmado' && !order.confirmationEmailSent) {
          emailData = buildConfirmationEmail(updatedOrder, items);
          updateFlags.confirmationEmailSent = true;
        } else if (status === 'En preparación') {
          emailData = buildPreparationEmail(updatedOrder, items);
        } else if (status === 'Enviado' && !order.shippingEmailSent) {
          emailData = buildShippingEmail(updatedOrder, items);
          updateFlags.shippingEmailSent = true;
        } else if (status === 'Entregado') {
          emailData = buildDeliveredEmail(updatedOrder, items);
        } else if (status === 'Cancelado') {
          emailData = buildCancelledEmail(updatedOrder, items);
        }

        if (emailData) {
          const sent = await sendEmail({
            to: order.customerEmail,
            toName: order.customerName,
            subject: emailData.subject,
            html: emailData.html,
          });
          
          if (sent && Object.keys(updateFlags).length > 0) {
            await db.update(orders).set(updateFlags).where(eq(orders.id, id));
          }
        }
      }

      return res.status(200).json({ message: `Pedido actualizado a ${status} y notificado al cliente.` });
    }

    if (req.method === 'DELETE') {
      const orderId = Number(req.query.id);
      if (!orderId) return res.status(400).json({ error: 'Missing order ID' });
      // Delete items first (FK), then the order
      await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
      await db.delete(orders).where(eq(orders.id, orderId));
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error('Admin Orders Error:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

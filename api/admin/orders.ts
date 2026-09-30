import { db } from '../../db';
import { orders, orderItems } from '../../db/schema';
import { verifyAuth } from '../utils/auth';
import { desc, eq } from 'drizzle-orm';
import { sendEmail, buildShippingEmail } from '../utils/email';

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

      // Special handling for "Enviado" status — requires tracking info
      if (status === 'Enviado') {
        if (!carrier || !trackingNumber) {
          return res.status(400).json({
            error: 'Para marcar como Enviado debes proporcionar la transportadora y el número de guía.',
            requiresTracking: true,
          });
        }

        // Fetch current order to check email sentinel
        const orderData = await db.select().from(orders).where(eq(orders.id, id));
        if (orderData.length === 0) return res.status(404).json({ error: 'Order not found' });
        const order = orderData[0];

        // Update with tracking info
        await db.update(orders).set({
          status: 'Enviado',
          carrier,
          trackingNumber,
          shippedAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(orders.id, id));

        // Send shipping email only if not already sent
        if (!order.shippingEmailSent && order.customerEmail) {
          const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
          const updatedOrder = { ...order, status: 'Enviado', carrier, trackingNumber, shippedAt: new Date() };
          const { subject, html } = buildShippingEmail(updatedOrder, items);
          const sent = await sendEmail({
            to: order.customerEmail,
            toName: order.customerName,
            subject,
            html,
          });

          if (sent) {
            await db.update(orders)
              .set({ shippingEmailSent: true })
              .where(eq(orders.id, id));
          }
        }

        return res.status(200).json({ message: 'Pedido marcado como Enviado y correo enviado al cliente.' });
      }

      // For all other status changes, just update normally
      await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
      return res.status(200).json({ message: 'Order updated' });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error('Admin Orders Error:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

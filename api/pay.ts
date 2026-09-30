import { db } from '../db';
import { orders, orderItems } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail, buildConfirmationEmail } from './utils/email';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { orderNumber } = req.body;

      if (!orderNumber) {
        return res.status(400).json({ error: 'Número de pedido requerido' });
      }

      // Find the order
      const orderList = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
      if (orderList.length === 0) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      const order = orderList[0];

      // Guard: only process if not already confirmed (prevent double-processing)
      if (order.status === 'Confirmado' || order.status === 'En preparación' || order.status === 'Enviado' || order.status === 'Entregado') {
        return res.status(200).json({ success: true, message: 'Pedido ya confirmado' });
      }

      // Mark as Confirmado
      await db.update(orders)
        .set({ status: 'Confirmado', updatedAt: new Date() })
        .where(eq(orders.orderNumber, orderNumber));

      // Send confirmation email only once (check flag)
      if (!order.confirmationEmailSent && order.customerEmail) {
        // Fetch items for this order
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        const { subject, html } = buildConfirmationEmail({ ...order, status: 'Confirmado' }, items);
        const sent = await sendEmail({
          to: order.customerEmail,
          toName: order.customerName,
          subject,
          html,
        });

        if (sent) {
          // Mark email as sent to prevent duplicates
          await db.update(orders)
            .set({ confirmationEmailSent: true })
            .where(eq(orders.orderNumber, orderNumber));
        }
      }

      return res.status(200).json({ success: true, message: 'Pago confirmado y correo enviado' });
    } catch (err) {
      console.error('Error in pay API:', err);
      return res.status(500).json({ error: 'Error procesando el pago' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

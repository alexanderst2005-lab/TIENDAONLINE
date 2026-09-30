import { db } from '../db';
import { orders, orderItems } from '../db/schema';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { customerData, items, total, subtotal } = req.body;

      if (!customerData || !items || items.length === 0) {
        return res.status(400).json({ error: 'Faltan datos del cliente o productos' });
      }

      const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

      const [newOrder] = await db.insert(orders).values({
        orderNumber,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerCity: customerData.city,
        customerAddress: customerData.address,
        total: total,
        subtotal: subtotal,
        paymentMethod: customerData.payment_method || 'Contra Entrega',
        status: 'Pendiente'
      }).returning();

      for (const item of items) {
        await db.insert(orderItems).values({
          orderId: newOrder.id,
          productId: item.productId || item.id,
          productName: item.name,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price
        });
      }

      return res.status(200).json({ success: true, orderNumber });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error procesando el pedido' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

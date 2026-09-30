import { db } from '../db';
import { orders } from '../db/schema';
import { eq } from 'drizzle-orm';

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

      // Mark it as Confirmado
      await db.update(orders)
        .set({ status: 'Confirmado' })
        .where(eq(orders.orderNumber, orderNumber));

      return res.status(200).json({ success: true, message: 'Pago simulado con éxito' });
    } catch (err) {
      console.error('Error in mock payment API:', err);
      return res.status(500).json({ error: 'Error procesando el pago' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}

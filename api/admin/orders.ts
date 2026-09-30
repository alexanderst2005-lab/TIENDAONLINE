import { db } from '../../db';
import { orders, orderItems } from '../../db/schema';
import { verifyAuth } from '../utils/auth';
import { desc, eq } from 'drizzle-orm';

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
      const { id, status } = req.body;
      if (!id || !status) return res.status(400).json({ error: 'Missing ID or status' });

      await db.update(orders).set({ status }).where(eq(orders.id, id));
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

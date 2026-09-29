import { db } from '../../db';
import { orders, products } from '../../db/schema';
import { verifyAuth } from '../utils/auth';
import { desc, sql, gte, eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Check Auth
    verifyAuth(req);

    // Get today's start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch basic stats
    const todayOrders = await db.select()
      .from(orders)
      .where(gte(orders.createdAt, today));
    
    const salesToday = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    const pendingOrdersCountRes = await db.select({ count: sql`count(*)` })
      .from(orders)
      .where(eq(orders.status, 'Pendiente'));
    const pendingOrders = Number(pendingOrdersCountRes[0]?.count || 0);

    const activeProductsCountRes = await db.select({ count: sql`count(*)` })
      .from(products)
      .where(eq(products.isActive, true));
    const activeProducts = Number(activeProductsCountRes[0]?.count || 0);

    const lowStockCountRes = await db.select({ count: sql`count(*)` })
      .from(products)
      .where(sql`${products.stock} < 5`);
    const lowStockProducts = Number(lowStockCountRes[0]?.count || 0);

    // Fetch recent orders (limit 5)
    const recentOrders = await db.select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return res.status(200).json({
      salesToday,
      pendingOrders,
      activeProducts,
      lowStockProducts,
      recentOrders
    });
  } catch (error: any) {
    console.error('Dashboard Error:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import { db } from '../../db';
import { orders } from '../../db/schema';
import { verifyAuth } from '../utils/auth';
import { gte, and, not, eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  try {
    verifyAuth(req);

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { period = '7days' } = req.query;
    
    // Determine the start date based on the period
    const now = new Date();
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (period === 'today') {
      // Already set to start of today
    } else if (period === '7days') {
      startDate.setDate(startDate.getDate() - 6);
    } else if (period === '30days') {
      startDate.setDate(startDate.getDate() - 29);
    } else if (period === 'month') {
      startDate.setDate(1); // First day of current month
    }

    // Fetch all non-cancelled orders from the start date
    const salesData = await db.select().from(orders).where(
      and(
        gte(orders.createdAt, startDate),
        not(eq(orders.status, 'Cancelado'))
      )
    );

    let totalSales = 0;
    let totalOrders = salesData.length;
    const chartMap = new Map();

    // Initialize map with all days in the range to ensure continuous chart (filled with 0s)
    let current = new Date(startDate);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0]; // YYYY-MM-DD
      chartMap.set(dateStr, 0);
      current.setDate(current.getDate() + 1);
    }

    // Accumulate sales
    salesData.forEach(order => {
      totalSales += order.total;
      if (order.createdAt) {
        const d = new Date(order.createdAt);
        const dateStr = d.toISOString().split('T')[0];
        if (chartMap.has(dateStr)) {
          chartMap.set(dateStr, chartMap.get(dateStr) + order.total);
        }
      }
    });

    const chartData = Array.from(chartMap.entries()).map(([date, amount]) => ({ date, amount })).sort((a, b) => a.date.localeCompare(b.date));

    return res.status(200).json({
      totalSales,
      totalOrders,
      chartData
    });

  } catch (error: any) {
    console.error('Admin Sales Error:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

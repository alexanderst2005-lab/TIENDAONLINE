import { db } from '../../db';
import { orders, products, orderItems } from '../../db/schema';
import { verifyAuth } from '../_utils/auth';
import { desc, eq, ne } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    verifyAuth(req);

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allProducts = await db.select().from(products);
    const allItems = await db.select().from(orderItems);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);
    const lastWeekStart = new Date(startOfWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    let ingresosMes = 0;
    let ingresosSemana = 0;
    let ingresosSemanaAnterior = 0;
    let ingresosTotales = 0;
    let confirmadosCount = 0;
    const pedidosPorEstado: any = {};

    allOrders.forEach(o => {
      const orderDate = new Date(o.createdAt || new Date());
      pedidosPorEstado[o.status] = (pedidosPorEstado[o.status] || 0) + 1;

      if (o.status !== 'Cancelado') {
        ingresosTotales += o.total;
        if (orderDate >= startOfMonth) ingresosMes += o.total;
        if (orderDate >= startOfWeek) ingresosSemana += o.total;
        else if (orderDate >= lastWeekStart && orderDate < startOfWeek) ingresosSemanaAnterior += o.total;
      }

      if (o.status === 'Confirmado' || o.status === 'En preparación' || o.status === 'Enviado' || o.status === 'Entregado') {
        confirmadosCount++;
      }
    });

    const percentChange = ingresosSemanaAnterior > 0 
      ? Math.round(((ingresosSemana - ingresosSemanaAnterior) / ingresosSemanaAnterior) * 100) 
      : 100;

    const topProductsMap: any = {};
    allItems.forEach(item => {
      topProductsMap[item.productId] = (topProductsMap[item.productId] || 0) + item.quantity;
    });
    
    const topProducts = Object.entries(topProductsMap)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, qty]) => {
        const p = allProducts.find(prod => prod.id.toString() === id.toString());
        return { name: p?.name || 'Desconocido', qty, price: p?.price || 0 };
      });

    const stockCritico = allProducts.filter(p => p.stock > 0 && p.stock <= 5).length;
    const isInventarioOptimo = stockCritico === 0 && allProducts.length > 0;

    return res.status(200).json({
      ingresosMes,
      ingresosSemana,
      percentChange,
      totalPedidos: allOrders.length,
      confirmadosCount,
      ingresosTotales,
      topProducts,
      pedidosPorEstado,
      stockCritico,
      isInventarioOptimo,
      recentOrders: allOrders.slice(0, 5)
    });
  } catch (error: any) {
    console.error('Dashboard Error:', error);
    if (error.message === 'Unauthorized') return res.status(401).json({ error: 'Unauthorized' });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

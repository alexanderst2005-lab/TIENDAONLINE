import { db } from '../db';
import { products } from '../db/schema';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const allProducts = await db.select().from(products);
      res.status(200).json(allProducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

import { db } from '../db';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const allCategories = await db.select().from(categories).where(eq(categories.isActive, true));
      res.status(200).json(allCategories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

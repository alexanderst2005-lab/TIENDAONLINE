import { db } from '../../db';
import { categories } from '../../db/schema';
import { verifyAuth } from '../_utils/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  try {
    verifyAuth(req);

    if (req.method === 'GET') {
      const allCategories = await db.select().from(categories);
      return res.status(200).json(allCategories);
    } 
    
    if (req.method === 'POST') {
      const { name, slug, isActive } = req.body;
      if (!name) return res.status(400).json({ error: 'Name is required' });

      await db.insert(categories).values({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        isActive: isActive !== false,
      });
      return res.status(201).json({ message: 'Category created' });
    }

    if (req.method === 'PUT') {
      const { id, name, slug, isActive } = req.body;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      
      await db.update(categories).set({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        isActive,
      }).where(eq(categories.id, id));
      
      return res.status(200).json({ message: 'Category updated' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await db.delete(categories).where(eq(categories.id, Number(id)));
      return res.status(200).json({ message: 'Category deleted' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error('Admin Categories Error:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

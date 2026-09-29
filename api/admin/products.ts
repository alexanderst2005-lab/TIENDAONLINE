import { db } from '../../db';
import { products } from '../../db/schema';
import { verifyAuth } from '../utils/auth';
import { eq } from 'drizzle-orm';

export default async function handler(req: any, res: any) {
  try {
    verifyAuth(req);

    if (req.method === 'GET') {
      const allProducts = await db.select().from(products);
      return res.status(200).json(allProducts);
    } 
    
    if (req.method === 'POST') {
      // Create new product
      const data = req.body;
      await db.insert(products).values({
        id: data.id || `prod-${Date.now()}`,
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\\s+/g, '-'),
        price: Number(data.price),
        category: data.category,
        categoryLabel: data.categoryLabel,
        description: data.description || '',
        stock: Number(data.stock || 0),
        isActive: data.isActive !== false,
        images: data.images || []
      });
      return res.status(201).json({ message: 'Product created' });
    }

    if (req.method === 'PUT') {
      const data = req.body;
      if (!data.id) return res.status(400).json({ error: 'Missing ID' });
      
      await db.update(products).set({
        name: data.name,
        price: Number(data.price),
        category: data.category,
        categoryLabel: data.categoryLabel,
        description: data.description,
        stock: Number(data.stock),
        isActive: data.isActive,
        images: data.images
      }).where(eq(products.id, data.id));
      
      return res.status(200).json({ message: 'Product updated' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await db.delete(products).where(eq(products.id, id));
      return res.status(200).json({ message: 'Product deleted' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error: any) {
    console.error('Admin Products Error:', error);
    if (error.message === 'Unauthorized') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import { db } from './db';
import { categories } from './db/schema';

async function seed() {
  try {
    const existing = await db.select().from(categories);
    if (existing.length === 0) {
      await db.insert(categories).values([
        {name: 'Blusas y Tops', slug: 'blusas'},
        {name: 'Vestidos', slug: 'vestidos'},
        {name: 'Pantalones y Faldas', slug: 'pantalones'},
        {name: 'Cuidado Corporal', slug: 'cuidado'}
      ]);
      console.log('Categories seeded successfully!');
    } else {
      console.log('Categories already exist, skipping.');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
  process.exit(0);
}

seed();

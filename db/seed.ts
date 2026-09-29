import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './index';
import { products } from './schema';

// The original product data from your data.js
const initialProducts = [
  {
    id: 'blusa-seda',
    name: 'Blusa de Seda Estampada',
    slug: 'blusa-seda-estampada',
    price: 65000,
    category: 'blusas',
    categoryLabel: 'Blusas y Tops',
    stock: 12,
    isNew: true,
    description: 'Blusa de seda suave con estampado floral de temporada. Perfecta para ocasiones casuales o eventos semi-formales.',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Floral', hex: '#E5D6D0' }, { name: 'Azul Noche', hex: '#2C3E50' }],
    images: ['images/prod-manga-larga.jpg', 'images/prod-jeans-slim.jpg']
  },
  {
    id: 'top-basico',
    name: 'Top Básico Rib',
    slug: 'top-basico-rib',
    price: 35000,
    category: 'blusas',
    categoryLabel: 'Blusas y Tops',
    stock: 25,
    isNew: false,
    description: 'Top básico en tejido rib, cuello cuadrado. Un esencial para cualquier armario.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Blanco', hex: '#FFFFFF' }, { name: 'Negro', hex: '#000000' }, { name: 'Beige', hex: '#F5F5DC' }],
    images: ['images/prod-oversize.jpg', 'images/prod-manga-larga.jpg']
  },
  {
    id: 'vestido-largo',
    name: 'Vestido Largo Fluido',
    slug: 'vestido-largo-fluido',
    price: 110000,
    category: 'vestidos',
    categoryLabel: 'Vestidos',
    stock: 8,
    isNew: true,
    description: 'Vestido largo y fluido con abertura lateral y tirantes ajustables. Elegancia garantizada.',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Verde Salvia', hex: '#8A9A5B' }, { name: 'Vino', hex: '#722F37' }],
    images: ['images/destacado.jpg', 'images/hero1.jpg']
  },
  {
    id: 'falda-midi',
    name: 'Falda Midi Satinada',
    slug: 'falda-midi-satinada',
    price: 75000,
    category: 'pantalones',
    categoryLabel: 'Faldas y Pantalones',
    stock: 15,
    isNew: false,
    description: 'Falda corte midi en satén. Caída perfecta que estiliza la figura.',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Champagne', hex: '#F7E7CE' }, { name: 'Negro', hex: '#000000' }],
    images: ['images/cat-pantaloneta.jpg', 'images/cat-polo.jpg']
  },
  {
    id: 'crema-hidratante',
    name: 'Crema Hidratante Corporal',
    slug: 'crema-hidratante-corporal',
    price: 45000,
    category: 'cuidado',
    categoryLabel: 'Cuidado Corporal',
    stock: 30,
    isNew: true,
    description: 'Crema ultra hidratante con manteca de karité y extracto de vainilla. Deja tu piel suave e iluminada.',
    sizes: ['250ml', '500ml'],
    colors: [],
    images: ['images/hero2.jpg', 'images/cat-jeans.jpg']
  },
  {
    id: 'exfoliante-cafe',
    name: 'Exfoliante Corporal de Café',
    slug: 'exfoliante-corporal-cafe',
    price: 38000,
    category: 'cuidado',
    categoryLabel: 'Cuidado Corporal',
    stock: 20,
    isNew: false,
    description: 'Exfoliante natural a base de café y aceites esenciales. Renueva tu piel eliminando células muertas.',
    sizes: ['200g'],
    colors: [],
    images: ['images/cat-jeans.jpg', 'images/hero2.jpg']
  }
];

async function seed() {
  console.log('Seeding database...');
  try {
    for (const p of initialProducts) {
      await db.insert(products).values(p);
      console.log(`Inserted product: ${p.name}`);
    }
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();

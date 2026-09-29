import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  price: integer('price').notNull(),
  category: text('category').notNull(),
  categoryLabel: text('category_label').notNull(),
  stock: integer('stock').notNull().default(10),
  isNew: boolean('is_new').default(false),
  description: text('description').notNull(),
  sizes: jsonb('sizes').$type<string[]>(),
  colors: jsonb('colors').$type<{name: string, hex: string}[]>(),
  images: jsonb('images').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

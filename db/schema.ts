import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  isActive: boolean('is_active').default(true),
});

export const collections = pgTable('collections', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  isActive: boolean('is_active').default(true),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  categoryId: integer('category_id'), // relation to categories
  collectionId: integer('collection_id'), // relation to collections
  category: text('category').notNull(), // kept for backward compatibility
  categoryLabel: text('category_label').notNull(),
  stock: integer('stock').notNull().default(10), // total stock or generic stock
  isNew: boolean('is_new').default(false),
  isFeatured: boolean('is_featured').default(false),
  isActive: boolean('is_active').default(true),
  description: text('description').notNull(),
  sizes: jsonb('sizes').$type<string[]>(),
  colors: jsonb('colors').$type<{name: string, hex: string}[]>(),
  images: jsonb('images').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: text('product_id').notNull(),
  size: text('size'),
  color: text('color'),
  stock: integer('stock').notNull().default(0),
});

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  city: text('city'),
  totalSpent: integer('total_spent').default(0),
  ordersCount: integer('orders_count').default(0),
  lastOrderAt: timestamp('last_order_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerId: integer('customer_id'),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  customerCity: text('customer_city'),
  customerDepartment: text('customer_department'),
  customerAddress: text('customer_address'),
  customerCedula: text('customer_cedula'),
  total: integer('total').notNull(),
  subtotal: integer('subtotal').notNull(),
  shipping: integer('shipping').default(0),
  discount: integer('discount').default(0),
  paymentMethod: text('payment_method'),
  status: text('status').notNull().default('Pendiente'), // Pendiente, Confirmado, En preparación, Enviado, Entregado, Cancelado
  // Shipping tracking
  carrier: text('carrier'),           // transportadora
  trackingNumber: text('tracking_number'),
  shippedAt: timestamp('shipped_at'),
  // Email control flags (prevent duplicate sends)
  confirmationEmailSent: boolean('confirmation_email_sent').default(false),
  shippingEmailSent: boolean('shipping_email_sent').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  productId: text('product_id'),
  productName: text('product_name').notNull(),
  image: text('image'),
  size: text('size'),
  color: text('color'),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});

export const storeSettings = pgTable('store_settings', {
  id: text('id').primaryKey(), // using a single row like 'main'
  storeName: text('store_name'),
  email: text('email'),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  instagram: text('instagram'),
  tiktok: text('tiktok'),
  address: text('address'),
  shippingCost: integer('shipping_cost').default(0),
  freeShippingThreshold: integer('free_shipping_threshold'),
});

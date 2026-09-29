import { db } from '../../db';
import { adminUsers } from '../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'monatela-super-secret-key-2026';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if user exists
    let users = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    
    // Auto-seed an admin if the table is completely empty (for development only)
    if (users.length === 0) {
      const allUsers = await db.select().from(adminUsers);
      if (allUsers.length === 0 && email === 'admin@monatela.com') {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.insert(adminUsers).values({
          email: 'admin@monatela.com',
          name: 'Administrador',
          passwordHash: hashedPassword
        });
        users = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

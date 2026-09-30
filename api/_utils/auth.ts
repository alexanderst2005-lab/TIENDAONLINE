import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'monatela-super-secret-key-2026';

export function verifyAuth(req: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Unauthorized');
  }
}

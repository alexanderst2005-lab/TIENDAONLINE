/**
 * Generates the Wompi integrity signature for secure transactions.
 * Formula: SHA256(reference + amountInCents + currency + integritySecret)
 */
import { createHash } from 'crypto';

export function generateWompiSignature(reference, amountInCents, currency = 'COP') {
  const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!integritySecret) throw new Error('WOMPI_INTEGRITY_SECRET not set');
  
  const signatureString = `${reference}${amountInCents}${currency}${integritySecret}`;
  return createHash('sha256').update(signatureString).digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { orderNumber, amountCOP } = req.body;
    if (!orderNumber || !amountCOP) {
      return res.status(400).json({ error: 'Missing orderNumber or amountCOP' });
    }
    
    const amountInCents = Math.round(amountCOP * 100);
    const signature = generateWompiSignature(orderNumber, amountInCents, 'COP');
    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    
    return res.status(200).json({ 
      signature, 
      amountInCents, 
      publicKey,
      reference: orderNumber
    });
  } catch (err) {
    console.error('[Wompi Signature]', err);
    return res.status(500).json({ error: err.message });
  }
}

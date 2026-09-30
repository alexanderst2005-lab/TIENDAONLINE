export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  try {
    const { orderNumber, total } = req.body;
    if (!orderNumber || !total) {
      return res.status(400).json({ error: 'Missing orderNumber or total' });
    }
    
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not set');
    }

    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    const preference = {
      items: [
        {
          title: `Pedido ${orderNumber}`,
          quantity: 1,
          currency_id: 'COP',
          unit_price: Number(total)
        }
      ],
      external_reference: orderNumber,
      back_urls: {
        success: `${baseUrl}/pago.html?order=${orderNumber}&total=${total}&status=success`,
        failure: `${baseUrl}/pago.html?order=${orderNumber}&total=${total}&status=failure`,
        pending: `${baseUrl}/pago.html?order=${orderNumber}&total=${total}&status=pending`
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/mercadopago/webhook`
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[MP Preference Error]', errorData);
      throw new Error('Error creating preference');
    }

    const data = await response.json();
    
    return res.status(200).json({ 
      init_point: data.init_point
    });
  } catch (err) {
    console.error('[MercadoPago Preference]', err);
    return res.status(500).json({ error: err.message });
  }
}

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import orangeRoutes from './routes/orange.js';
app.use('/api/payment', orangeRoutes);


dotenv.config();

const router = express.Router();

const ORANGE_BASE_URL = 'https://api.orange.com';

async function getAccessToken() {
  const credentials = Buffer.from(`${process.env.ORANGE_CLIENT_ID}:${process.env.ORANGE_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${ORANGE_BASE_URL}/oauth/v3/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

router.post('/orange/pay', async (req, res) => {
  const { amount, phoneNumber } = req.body;

  if (!amount || !phoneNumber) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  try {
    const token = await getAccessToken();

    const response = await fetch(`${ORANGE_BASE_URL}/omcore/1.0.2/mp/payment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Callback-URL': 'https://your-app.com/callback', // ou laisse vide pour test
        'X-Partner-Id': process.env.ORANGE_PARTNER_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: `${amount}`,
        currency: 'XAF',
        externalId: `TXN_${Date.now()}`,
        payee: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber,
        },
        payerMessage: 'Paiement Apple Service',
        payeeNote: 'Merci pour votre achat.',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Erreur API Orange:', err);
      return res.status(500).json({ success: false, message: 'Paiement échoué' });
    }

    const result = await response.json();
    console.log('Réponse API Orange:', result);

    res.json({ success: true, transactionId: result.transactionId || `TXN_${Date.now()}` });
  } catch (error) {
    console.error('Erreur paiement Orange:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

export default router;

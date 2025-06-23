import type { PaymentMethod } from '../types';

export interface PaymentData {
  amount: number;
  method: PaymentMethod;
  phoneNumber?: string;
  email?: string;
  bitcoinAddress?: string;
}

export const paymentService = {
  // 🔐 Appel au backend pour obtenir le token Orange
  async getOrangeToken(): Promise<string | null> {
    try {
      const response = await fetch('http://localhost:5000/api/payment/orange/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      return data.access_token || null;
    } catch (error) {
      console.error('Erreur token Orange:', error);
      return null;
    }
  },

  // 🟠 Paiement Orange (appel backend réel)
  async processOrangeMoney(paymentData: PaymentData): Promise<{ success: boolean; transactionId?: string }> {
    try {
      const response = await fetch('http://localhost:5000/api/payment/orange/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          transactionId: data.transactionId,
        };
      } else {
        console.error('Paiement Orange échoué:', data.message || data);
        return { success: false };
      }
    } catch (error) {
      console.error('Erreur processOrangeMoney:', error);
      return { success: false };
    }
  },

  // 🔁 Méthode principale
  async processPayment(paymentData: PaymentData): Promise<{ success: boolean; transactionId?: string }> {
    if (paymentData.method === 'orange-money') {
      return await paymentService.processOrangeMoney(paymentData);
    }

    // 🧪 Simulation pour les autres méthodes
    await new Promise(resolve => setTimeout(resolve, 2000));
    const success = Math.random() > 0.1;

    if (success) {
      return {
        success: true,
        transactionId: `MOCK_TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return { success: false };
    }
  },

  // ✅ Validation
  validatePaymentData(paymentData: PaymentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (paymentData.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    switch (paymentData.method) {
      case 'orange-money':
      case 'mtn-momo':
        if (!paymentData.phoneNumber || !/^\+?[1-9]\d{8,14}$/.test(paymentData.phoneNumber)) {
          errors.push('Valid phone number is required');
        }
        break;
      case 'paypal':
        if (!paymentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
          errors.push('Valid email is required');
        }
        break;
      case 'bitcoin':
        if (!paymentData.bitcoinAddress || paymentData.bitcoinAddress.length < 26) {
          errors.push('Valid Bitcoin address is required');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}; // ← cette accolade FERMANTE ici était probablement manquante

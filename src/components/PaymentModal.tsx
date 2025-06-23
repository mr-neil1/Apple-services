import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Smartphone, Bitcoin, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { AppleProduct, PaymentMethod } from '../types';
import { paymentService, type PaymentData } from '../services/payment';
import { allocationService } from '../services/allocation';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: AppleProduct;
  onPaymentSuccess: () => void;
}

const paymentMethods = [
  { id: 'orange-money', name: 'Orange Money', icon: Smartphone },
  { id: 'mtn-momo', name: 'MTN MoMo', icon: Smartphone },
  { id: 'paypal', name: 'PayPal', icon: Mail },
  { id: 'bitcoin', name: 'Bitcoin', icon: Bitcoin },
];

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, product, onPaymentSuccess }) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('orange-money');
  const [formData, setFormData] = useState({ phoneNumber: '', email: '', bitcoinAddress: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    if (!user) {
      setError("Veuillez vous connecter pour effectuer un paiement.");
      setIsProcessing(false);
      return;
    }

    const paymentData: PaymentData = {
      amount: product.price,
      method: selectedMethod,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      bitcoinAddress: formData.bitcoinAddress,
    };

    const validation = paymentService.validatePaymentData(paymentData);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      setIsProcessing(false);
      return;
    }

    try {
      // TODO: Appeler ici une vraie API de paiement (Orange, MTN, PayPal, etc.)
      const result = await paymentService.processPayment(paymentData);

      if (result.success) {
        await allocationService.createAllocation(user.id, product.id, selectedMethod);
        onPaymentSuccess();
        onClose();
      } else {
        setError('Le paiement a échoué. Veuillez réessayer.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Une erreur est survenue pendant le paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentFields = () => {
    switch (selectedMethod) {
      case 'orange-money':
      case 'mtn-momo':
        return (
          <input
            type="tel"
            placeholder="Ex: +237 6XX XXX XXX"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        );
      case 'paypal':
        return (
          <input
            type="email"
            placeholder="Votre adresse PayPal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        );
      case 'bitcoin':
        return (
          <input
            type="text"
            placeholder="Adresse Bitcoin"
            value={formData.bitcoinAddress}
            onChange={(e) => setFormData({ ...formData, bitcoinAddress: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Paiement pour : {product.name}
            </h2>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total</span>
                <span className="font-bold text-gray-800">${product.price}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map(({ id, name, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSelectedMethod(id as PaymentMethod)}
                      className={`flex items-center justify-center space-x-2 border rounded-lg p-2 transition ${
                        selectedMethod === id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Informations de paiement
                </label>
                {renderPaymentFields()}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-sm text-red-600 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    'Payer maintenant'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;

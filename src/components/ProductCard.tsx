import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import type { AppleProduct } from '../types';
import PaymentModal from './PaymentModal';

interface ProductCardProps {
  product: AppleProduct;
  onAllocate?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAllocate }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleAllocateClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    onAllocate?.(product.id);
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="aspect-w-16 aspect-h-9 bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-green-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>Daily Revenue</span>
              </div>
              <span className="font-semibold text-green-600">
                ${product.dailyRevenue}/day
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-blue-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Withdrawal Period</span>
              </div>
              <span className="font-semibold text-blue-600">
                {product.withdrawalPeriod} days
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-purple-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Potential Earnings</span>
              </div>
              <span className="font-semibold text-purple-600">
                ${(product.dailyRevenue * product.withdrawalPeriod).toFixed(2)}
              </span>
            </div>
          </div>
          
          <motion.button
            onClick={handleAllocateClick}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Allocate Service
          </motion.button>
        </div>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        product={product}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default ProductCard;
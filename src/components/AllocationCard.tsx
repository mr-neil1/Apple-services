import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { Allocation } from '../types';
import { productService } from '../services/products';
import { allocationService } from '../services/allocation';

interface AllocationCardProps {
  allocation: Allocation;
  onWithdraw?: (allocationId: string) => void;
}

const AllocationCard: React.FC<AllocationCardProps> = ({ allocation, onWithdraw }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [currentRevenue, setCurrentRevenue] = useState(allocation.totalRevenue);
  const [canWithdraw, setCanWithdraw] = useState(allocation.canWithdraw);

  const product = productService.getProductById(allocation.productId);

  useEffect(() => {
    const updateRevenue = async () => {
      try {
        await allocationService.generateDailyRevenue(allocation);
        
        // Calculate current revenue
        const now = new Date();
        const daysSinceAllocation = Math.floor(
          (now.getTime() - allocation.allocationDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        const newRevenue = daysSinceAllocation * allocation.dailyRevenue;
        setCurrentRevenue(newRevenue);
        
        if (product) {
          setCanWithdraw(daysSinceAllocation >= product.withdrawalPeriod);
        }
      } catch (error) {
        console.error('Failed to update revenue:', error);
      }
    };

    updateRevenue();
    const interval = setInterval(updateRevenue, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [allocation, product]);

  useEffect(() => {
    if (!product || canWithdraw) return;

    const calculateTimeRemaining = () => {
      const withdrawalDate = new Date(allocation.allocationDate);
      withdrawalDate.setDate(withdrawalDate.getDate() + product.withdrawalPeriod);
      
      const now = new Date();
      const diff = withdrawalDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Ready to withdraw');
        setCanWithdraw(true);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [allocation, product, canWithdraw]);

  const handleWithdraw = async () => {
    if (!canWithdraw || allocation.withdrawnAt) return;
    
    try {
      await allocationService.withdrawEarnings(allocation.id);
      onWithdraw?.(allocation.id);
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };

  if (!product) return null;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">
            Allocated on {allocation.allocationDate.toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-xl font-bold text-gray-900">${allocation.totalPaid}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center text-green-600 mb-1">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Current Revenue</span>
          </div>
          <p className="text-lg font-bold text-green-700">
            ${currentRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center text-blue-600 mb-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Daily Rate</span>
          </div>
          <p className="text-lg font-bold text-blue-700">
            ${allocation.dailyRevenue}/day
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">Withdrawal Status</span>
        </div>
        <div className="flex items-center">
          {canWithdraw ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">Ready</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium text-orange-600">{timeRemaining}</span>
            </>
          )}
        </div>
      </div>

      <motion.button
        onClick={handleWithdraw}
        disabled={!canWithdraw || !!allocation.withdrawnAt}
        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
          canWithdraw && !allocation.withdrawnAt
            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={canWithdraw && !allocation.withdrawnAt ? { scale: 1.02 } : {}}
        whileTap={canWithdraw && !allocation.withdrawnAt ? { scale: 0.98 } : {}}
      >
        {allocation.withdrawnAt 
          ? 'Withdrawn' 
          : canWithdraw 
            ? `Withdraw $${currentRevenue.toFixed(2)}` 
            : 'Withdrawal Pending'
        }
      </motion.button>
    </motion.div>
  );
};

export default AllocationCard;
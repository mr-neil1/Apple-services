import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, DollarSign, Package, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/products';
import { allocationService } from '../services/allocation';
import type { Allocation } from '../types';
import ProductCard from '../components/ProductCard';
import AllocationCard from '../components/AllocationCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'allocations'>('products');
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAllocated, setTotalAllocated] = useState(0);

  const products = productService.getAllProducts();

  useEffect(() => {
    if (user) {
      loadAllocations();
    }
  }, [user]);

  const loadAllocations = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userAllocations = await allocationService.getUserAllocations(user.id);
      setAllocations(userAllocations);
      
      // Calculate totals
      const total = userAllocations.reduce((sum, allocation) => sum + allocation.totalPaid, 0);
      const revenue = userAllocations.reduce((sum, allocation) => sum + allocation.totalRevenue, 0);
      
      setTotalAllocated(total);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error('Failed to load allocations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductAllocate = (productId: string) => {
    loadAllocations(); // Refresh allocations after successful allocation
    setActiveTab('allocations'); // Switch to allocations tab
  };

  const handleWithdraw = (allocationId: string) => {
    loadAllocations(); // Refresh allocations after withdrawal
  };

  const stats = [
    {
      icon: Package,
      label: 'Active Allocations',
      value: allocations.length.toString(),
      color: 'blue'
    },
    {
      icon: DollarSign,
      label: 'Total Allocated',
      value: `$${totalAllocated.toFixed(2)}`,
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.email}
          </h1>
          <p className="text-gray-600">
            Manage your Apple service allocations and track your daily earnings.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="h-4 w-4 mr-2 inline" />
              Available Products
            </button>
            <button
              onClick={() => setActiveTab('allocations')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'allocations'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2 inline" />
              My Allocations ({allocations.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'products' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Apple Products</h2>
                <p className="text-gray-600">
                  Choose a product to allocate and start earning daily returns
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAllocate={handleProductAllocate}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Allocations</h2>
                <button
                  onClick={loadAllocations}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading your allocations...</p>
                </div>
              ) : allocations.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Allocations Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start by allocating your first Apple service to begin earning daily returns.
                  </p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {allocations.map((allocation) => (
                    <AllocationCard
                      key={allocation.id}
                      allocation={allocation}
                      onWithdraw={handleWithdraw}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, TrendingUp, Clock, Star } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Bank-level security with encrypted transactions and secure data storage.'
    },
    {
      icon: TrendingUp,
      title: 'Daily Returns',
      description: 'Generate consistent daily revenue from your allocated Apple services.'
    },
    {
      icon: Clock,
      title: 'Flexible Withdrawals',
      description: 'Withdraw your earnings after the completion of each service period.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Tech Investor',
      content: 'The daily returns are consistent and the platform is incredibly user-friendly.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      content: 'I\'ve allocated services for multiple products and the results exceeded my expectations.',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'Student',
      content: 'Perfect way to generate passive income while supporting Apple services.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Allocate Apple Services,
                <span className="text-blue-600 block">Earn Daily Returns</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of users who are generating consistent daily revenue by allocating 
                premium Apple services. Secure, transparent, and profitable.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-2xl hover:border-gray-400 transition-all"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <div className="relative z-10">
                <img
                  src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Apple Products"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Apple Services Allocation?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of service allocation with our secure, transparent, 
              and profitable platform designed for modern investors.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '10,000+', label: 'Active Users' },
              { value: '$2.5M+', label: 'Total Earnings' },
              { value: '98%', label: 'Success Rate' },
              { value: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users who are earning daily with our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Earning Daily Returns?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our platform today and start allocating Apple services for consistent daily revenue.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTrap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-10 py-4 bg-blue-600 text-white text-lg font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
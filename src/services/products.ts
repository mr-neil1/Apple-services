import type { AppleProduct } from '../types';

export const appleProducts: AppleProduct[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    category: 'iPhone',
    price: 999,
    image: 'https://images.pexels.com/photos/18525574/pexels-photo-18525574.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'The most advanced iPhone ever with titanium design and A17 Pro chip.',
    dailyRevenue: 15.50,
    withdrawalPeriod: 7
  },
  {
    id: 'macbook-pro-m3',
    name: 'MacBook Pro M3',
    category: 'MacBook',
    price: 1599,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500',
    description: 'Supercharged by M3 chip for incredible performance and battery life.',
    dailyRevenue: 28.75,
    withdrawalPeriod: 10
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd generation)',
    category: 'AirPods',
    price: 249,
    image: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Adaptive Audio and Personalized Spatial Audio for immersive sound.',
    dailyRevenue: 4.25,
    withdrawalPeriod: 5
  },
  {
    id: 'ipad-pro-m2',
    name: 'iPad Pro M2',
    category: 'iPad',
    price: 799,
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'The ultimate iPad experience with M2 chip and Liquid Retina display.',
    dailyRevenue: 12.80,
    withdrawalPeriod: 6
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    category: 'Apple Watch',
    price: 799,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'The most rugged and capable Apple Watch with precision GPS.',
    dailyRevenue: 11.90,
    withdrawalPeriod: 8
  },
  {
    id: 'mac-studio-m2',
    name: 'Mac Studio M2',
    category: 'Mac',
    price: 1999,
    image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=500',
    description: 'Outrageous performance in a compact design with M2 Ultra chip.',
    dailyRevenue: 35.50,
    withdrawalPeriod: 12
  }
];

export const productService = {
  getAllProducts(): AppleProduct[] {
    return appleProducts;
  },

  getProductById(id: string): AppleProduct | undefined {
    return appleProducts.find(product => product.id === id);
  },

  getProductsByCategory(category: string): AppleProduct[] {
    return appleProducts.filter(product => product.category === category);
  }
};
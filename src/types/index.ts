export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AppleProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  dailyRevenue: number;
  withdrawalPeriod: number; // in days
}

export interface Allocation {
  id: string;
  userId: string;
  productId: string;
  allocationDate: Date;
  totalPaid: number;
  paymentMethod: PaymentMethod;
  dailyRevenue: number;
  totalRevenue: number;
  canWithdraw: boolean;
  withdrawnAt?: Date;
}

export interface Payment {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}

export type PaymentMethod = 'orange-money' | 'mtn-momo' | 'paypal' | 'bitcoin';

export interface DailyRevenue {
  id: string;
  allocationId: string;
  date: Date;
  amount: number;
  generated: boolean;
}
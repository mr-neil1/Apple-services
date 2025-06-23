import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Allocation, PaymentMethod, DailyRevenue } from '../types';
import { productService } from './products';

export const allocationService = {
  // Create new allocation
  async createAllocation(
    userId: string, 
    productId: string, 
    paymentMethod: PaymentMethod
  ): Promise<Allocation> {
    try {
      const product = productService.getProductById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const allocationId = `${userId}-${productId}-${Date.now()}`;
      const allocation: Allocation = {
        id: allocationId,
        userId,
        productId,
        allocationDate: new Date(),
        totalPaid: product.price,
        paymentMethod,
        dailyRevenue: product.dailyRevenue,
        totalRevenue: 0,
        canWithdraw: false
      };

      await setDoc(doc(db, 'allocations', allocationId), {
        ...allocation,
        allocationDate: Timestamp.fromDate(allocation.allocationDate)
      });

      return allocation;
    } catch (error) {
      throw new Error(`Failed to create allocation: ${error}`);
    }
  },

  // Get user allocations
  async getUserAllocations(userId: string): Promise<Allocation[]> {
    try {
      const q = query(
        collection(db, 'allocations'),
        where('userId', '==', userId),
        orderBy('allocationDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const allocations: Allocation[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allocations.push({
          ...data,
          allocationDate: data.allocationDate.toDate()
        } as Allocation);
      });

      return allocations;
    } catch (error) {
      throw new Error(`Failed to get allocations: ${error}`);
    }
  },

  // Generate daily revenue (simulation)
  async generateDailyRevenue(allocation: Allocation): Promise<void> {
    try {
      const now = new Date();
      const daysSinceAllocation = Math.floor(
        (now.getTime() - allocation.allocationDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceAllocation > 0) {
        const newTotalRevenue = daysSinceAllocation * allocation.dailyRevenue;
        const product = productService.getProductById(allocation.productId);
        
        if (product) {
          const canWithdraw = daysSinceAllocation >= product.withdrawalPeriod;
          
          await updateDoc(doc(db, 'allocations', allocation.id), {
            totalRevenue: newTotalRevenue,
            canWithdraw
          });
        }
      }
    } catch (error) {
      throw new Error(`Failed to generate daily revenue: ${error}`);
    }
  },

  // Withdraw earnings
  async withdrawEarnings(allocationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'allocations', allocationId), {
        withdrawnAt: Timestamp.fromDate(new Date()),
        canWithdraw: false,
        totalRevenue: 0
      });
    } catch (error) {
      throw new Error(`Failed to withdraw earnings: ${error}`);
    }
  }
};
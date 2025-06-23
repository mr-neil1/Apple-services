import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User } from '../types';

export const authService = {
  // Register new user
  async register(email: string, password: string, name?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: name || ''
      };

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.id), user);
      
      return user;
    } catch (error) {
      throw new Error(`Registration failed: ${(error as Error).message}`);

    }
  },

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        // Create user document if it doesn't exist
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!
        };
        await setDoc(doc(db, 'users', user.id), user);
        return user;
      }
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`);

    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Logout failed: ${(error as Error).message}`);
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as User);
        } else {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email!
          };
          await setDoc(doc(db, 'users', user.id), user);
          callback(user);
        }
      } else {
        callback(null);
      }
    });
  }
};
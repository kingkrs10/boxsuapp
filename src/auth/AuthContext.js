import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';
import { useToast } from '../components/common/Toast/useToast';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showToast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          setUser({
            ...user,
            userData: userDoc.exists() ? userDoc.data() : null
          });
          await AsyncStorage.setItem('user', JSON.stringify(user));
        } else {
          setUser(null);
          await AsyncStorage.removeItem('user');
        }
      } catch (error) {
        showToast('Error syncing user data', 'error');
        console.error('Auth state sync error:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      setUser({
        ...userCredential.user,
        userData: userDoc.exists() ? userDoc.data() : null
      });
      showToast('Welcome back!', 'success');
    } catch (error) {
      let errorMessage = 'Failed to sign in';
      
      // Provide user-friendly error messages
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
      setError(errorMessage);
      throw error;
    }
  };

  const register = async (email, password, userData) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        createdAt: new Date(),
        email
      });

      setUser({
        ...userCredential.user,
        userData
      });
      
      showToast('Account created successfully!', 'success');
    } catch (error) {
      let errorMessage = 'Failed to create account';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = error.message;
      }
      
      showToast(errorMessage, 'error');
      setError(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      await AsyncStorage.removeItem('user');
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Failed to log out', 'error');
      setError(error.message);
      throw error;
    }
  };

  const updateUserData = async (newData) => {
    try {
      if (!user) {
        showToast('No user logged in', 'error');
        return;
      }
      
      await setDoc(doc(db, 'users', user.uid), {
        ...user.userData,
        ...newData
      }, { merge: true });

      setUser(prev => ({
        ...prev,
        userData: { ...prev.userData, ...newData }
      }));
      
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
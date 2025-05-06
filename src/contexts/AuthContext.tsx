import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import apiService from '../services/api';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  points: number;
  skills: string[];
  learning: string[];
  profileCompleted: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setupProfile: (profileData: any) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Firebase user to our User type
  const formatUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      points: userData?.points || 0,
      skills: userData?.skills || [],
      learning: userData?.learning || [],
      profileCompleted: userData?.profileCompleted || false
    };
  };

  // Sign up function
  const signup = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Create user in Firebase Auth
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        points: 0,
        skills: [],
        learning: [],
        profileCompleted: false,
        createdAt: new Date().toISOString()
      });
      
      // Call API service
      await apiService.signup(email, password);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create an account');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      // Call API service
      await apiService.login(email, password);
      
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
      console.error('Logout error:', err);
    }
  };

  // Setup profile function
  const setupProfile = async (profileData: any) => {
    try {
      setError(null);
      setLoading(true);
      
      if (!currentUser) {
        throw new Error('No user is logged in');
      }
      
      // Update user document in Firestore
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName: profileData.name,
        skills: profileData.skills,
        learning: profileData.learning,
        photoURL: profileData.profilePicture,
        profileCompleted: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Call API service
      await apiService.setupProfile(profileData);
      
      // Update current user state
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          displayName: profileData.name,
          skills: profileData.skills,
          learning: profileData.learning,
          photoURL: profileData.profilePicture,
          profileCompleted: true
        };
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to set up profile');
      console.error('Setup profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const formattedUser = await formatUser(firebaseUser);
          setCurrentUser(formattedUser);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    setupProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


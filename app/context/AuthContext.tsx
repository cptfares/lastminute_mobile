import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../entities/user';
import { loginUser, registerUser } from '../service/service';

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    userName: string;
    email: string;
    password: string;
    age: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserLocally: (updatedUser: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password);
      const { token, user } = response;

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      setToken(token);
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (userData: {
    userName: string;
    email: string;
    password: string;
    age: string;
  }) => {
    try {
      const newUser = await registerUser(userData);
      await signIn(userData.email, userData.password); // Auto-login after sign-up
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUserLocally = async (updatedUser: Partial<User>) => {
    if (!user) return;

    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    await AsyncStorage.setItem('userData', JSON.stringify(newUser)); // Update AsyncStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signUp,
        signOut,
        updateUserLocally,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

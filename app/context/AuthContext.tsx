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
  }) => Promise<User>;
  signOut: () => Promise<void>;
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
      setIsLoading(true);
      // For demo purposes, we'll use mock data if the API call fails
      try {
        const response = await loginUser(email, password);
        const { token, user } = response;

        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        setToken(token);
        setUser(user);
      } catch (error) {
        console.error('API login failed, using mock data:', error);

        // Mock user data for demo purposes
        const mockUser = {
          _id: 'mock-user-id',
          userName: 'Demo User',
          email: email,
          age: '25',
          password: '',
          role: 'user' as const,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        };

        const mockToken = 'mock-token-' + Date.now();

        await AsyncStorage.setItem('userToken', mockToken);
        await AsyncStorage.setItem('userData', JSON.stringify(mockUser));

        setToken(mockToken);
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: {
    userName: string;
    email: string;
    password: string;
    age: string;
  }) => {
    try {
      setIsLoading(true);
      // Try to register with API
      try {
        const newUser = await registerUser(userData);
        // After successful registration, automatically sign in
        await signIn(userData.email, userData.password);
        return newUser;
      } catch (error) {
        console.error('API registration failed, using mock data:', error);

        // Mock registration for demo purposes
        const mockUser = {
          _id: 'mock-user-id-' + Date.now(),
          userName: userData.userName,
          email: userData.email,
          age: userData.age,
          password: '',
          role: 'user' as const,
          status: 'active' as const,
          createdAt: new Date().toISOString(),
        };

        const mockToken = 'mock-token-' + Date.now();

        await AsyncStorage.setItem('userToken', mockToken);
        await AsyncStorage.setItem('userData', JSON.stringify(mockUser));

        setToken(mockToken);
        setUser(mockUser);
        return mockUser;
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, signUp, signOut, isLoading }}
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

export default AuthContext;

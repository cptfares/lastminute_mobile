import { RegisterUser } from './../entities/user';
import axios from "axios";
import {User} from "../entities/user"
import { Product } from "../entities/product";
import { Transaction } from "../entities/transactions";

const api = axios.create({
  baseURL: "http://192.168.141.73:6005/api",
  headers: {
    "Content-Type": "application/json",
  },
});
interface LoginResponse {
  token: string;
}
interface ApiResponse<T> {
data: T;
msg?: string;
}


// Authentication APIs
export const loginUser = async (email: string, password: string): Promise<LoginResponse & { user: User }> => {
  try {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/signIn', { email, password });

    console.log("Login API Response:", response.data);

    if (!response.data.token) {
      throw new Error("Invalid response format: Missing token");
     
    }

    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.msg || "Error during login");
  }
};



export const registerUser = async (userData: RegisterUser): Promise<User> => {
  try {
    const response = await api.post<{ data: User }>('/users', userData);
    return response.data.data;
  } catch (error: any) {
    console.error("Registration Error:", error);
    throw new Error(error.response?.data?.msg || 'Error during registration');
  }
};

// User Management APIs
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (id: string, user: Partial<User>): Promise<any> => {
  try {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getOneUser = async (id: string, token: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Product Management APIs
export const addProduct = async (product: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.post("/products", product);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.msg || "Error adding product");
  }
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/products");
    return response.data.products;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const getProductsByType = async (type: string): Promise<Product[]> => {
  try {
    const response = await api.get(`/products/type/${type}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductByID = async (id: string): Promise<Product> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.product;
  } catch (error: any) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error: any) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const getProductByUserID = async (id: string): Promise<Product[]> => {
  try {
    const response = await api.get(`/productsbyusers/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user products:", error);
    throw error;
  }
};

// Transaction APIs
export const createPurchase = async (purchaseData: Partial<Transaction>): Promise<Transaction> => {
  try {
    const response = await api.post("/purchase", purchaseData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating purchase:", error.response || error.message);
    throw error;
  }
};

export const getAllPurchases = async (): Promise<Transaction[]> => {
  try {
    const response = await api.get("/purchases");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching purchases:", error);
    throw error;
  }
};

export const getPurchasesByUser = async (userId: string): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/purchases/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching purchases for user ${userId}:`, error);
    throw error;
  }
};

export const deletePurchase = async (purchaseId: string): Promise<any> => {
  try {
    const response = await api.delete(`/purchase/${purchaseId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting purchase ${purchaseId}:`, error);
    throw error;
  }
};

export const getPurchaseIdByUserAndProduct = async (
  userId: string,
  productId: string
): Promise<string> => {
  try {
    const response = await api.get(`/purchase/${userId}/${productId}`);
    return response.data.purchaseId;
  } catch (error: any) {
    console.error("Error fetching purchaseId:", error);
    throw error;
  }
};
// Fetch product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching purchaseId:", error);
    throw error;
  }
};

// Mock data for development
const mockProducts: Product[] = [
  {
    _id: '1',
    title: 'UFC 300 VIP Experience Digital Pass',
    price: 999.99,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1579882392185-ea7c6fd3a92a?w=800&auto=format&fit=crop&q=60'],
    sellerId: 'user1',
    type: 'concert_ticket',
    description: 'VIP experience for UFC 300. Includes digital access to exclusive content, pre-fight interviews, and behind-the-scenes footage.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'available',
    metadata: {
      concertTicket: {
        eventName: 'UFC 300',
        eventDate: '2025-04-15T19:00:00Z',
        seat: 'Digital Access'
      }
    }
  },
  {
    _id: '2',
    title: 'PlayStation Plus 12-Month Subscription',
    price: 59.99,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1592155931584-901ac15763e3?w=800&auto=format&fit=crop&q=60'],
    sellerId: 'user2',
    type: 'gaming_account',
    description: '12-month PlayStation Plus subscription. Get access to free monthly games, exclusive discounts, and online multiplayer.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'available',
    metadata: {
      gamingAccount: {
        platform: 'PlayStation',
        game: 'PlayStation Plus'
      }
    }
  },
  {
    _id: '3',
    title: 'Coachella 2025 Weekend Pass',
    price: 499.99,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60'],
    sellerId: 'user3',
    type: 'concert_ticket',
    description: 'Weekend pass for Coachella 2025. Experience the world\'s most famous music festival with this digital pass.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'available',
    metadata: {
      concertTicket: {
        eventName: 'Coachella 2025',
        eventDate: '2025-04-11T12:00:00Z',
        seat: 'General Admission'
      }
    }
  },
  {
    _id: '4',
    title: 'Netflix Premium Annual Gift Card',
    price: 215.88,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=60'],
    sellerId: 'user4',
    type: 'social_media_account',
    description: 'Annual Netflix Premium subscription gift card. Enjoy a year of unlimited streaming in 4K UHD.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'available',
    metadata: {
      socialMediaAccount: {
        platform: 'Netflix',
        followers: 0
      }
    }
  },
  {
    _id: '5',
    title: 'Tomorrowland 2025 Digital Festival Pass',
    price: 349.99,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=60'],
    sellerId: 'user5',
    type: 'concert_ticket',
    description: 'Digital pass for Tomorrowland 2025. Experience the world\'s premier electronic music festival.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'available',
    metadata: {
      concertTicket: {
        eventName: 'Tomorrowland 2025',
        eventDate: '2025-07-18T14:00:00Z',
        seat: 'Digital Access'
      }
    }
  },
  {
    _id: '6',
    title: 'Xbox Game Pass Ultimate 6-Month Code',
    price: 89.99,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&auto=format&fit=crop&q=60'],
    sellerId: 'user6',
    type: 'gaming_account',
    description: '6-month Xbox Game Pass Ultimate subscription. Get access to hundreds of high-quality games on Xbox and PC.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'available',
    metadata: {
      gamingAccount: {
        platform: 'Xbox',
        game: 'Game Pass Ultimate'
      }
    }
  },
];
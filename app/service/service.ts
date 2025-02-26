import { RegisterUser } from './../entities/user';
import axios from "axios";
import {User} from "../entities/user"
import { Product } from "../entities/product";
import { Transaction } from "../entities/transaction";

const api = axios.create({
  baseURL: "http://192.168.1.11:6005/api",
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
    return response.data;
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
    return response.data;
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

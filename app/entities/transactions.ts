export  interface Transaction {
    _id: string;
    buyerId: string; // Reference to User
    sellerId: string; // Reference to User
    productId: string; // Reference to Product
    amount: number;
    currency: string;
    status: "pending" | "completed" | "refunded" | "cancelled";
    createdAt: string;
    updatedAt: string;
    paymentMethod: "credit_card" | "paypal" | "stripe";
    deliveryStatus: "pending" | "delivered";
  }
  
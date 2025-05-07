export interface User {
    _id: string;
    userName: string;
    createdAt: string;
    email: string;
    age: string;
    password: string; // Should be stored securely (hashed)
    role: "user" | "admin";
    status: "active" | "banned";
  }
  export type RegisterUser = Omit<User, "_id" | "createdAt" | "role" | "status">;

export default User;
export interface WalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  relatedPurchase?: string;
  createdAt: Date;
}

export interface Wallet {
  userId: string;
  balance: number;
  transactions: WalletTransaction[];
  lastUpdated: Date;
}
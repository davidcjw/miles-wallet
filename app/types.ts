export interface BankAccount {
  id: string;
  bankName: string;
  cardName: string;
  points: number;
  expiryDate?: string; // YYYY-MM-DD
}

export interface LoyaltyAccount {
  id: string;
  programmeName: string;
  miles: number;
  expiryDate?: string; // YYYY-MM-DD
}

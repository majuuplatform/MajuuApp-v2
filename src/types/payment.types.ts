export type PaymentRecord = {
  id: string;
  requestId: string;
  amount: number;
  currency: 'USD' | 'KES' | 'EUR';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt?: string;
  updatedAt?: string;
};

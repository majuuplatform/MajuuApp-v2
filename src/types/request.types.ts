export type RequestRecord = {
  id: string;
  serviceId: string;
  userId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

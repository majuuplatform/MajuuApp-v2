export type AuthUser = {
  id: string;
  email: string;
  fullName?: string;
  role?: 'user' | 'agency-admin' | 'super-admin';
  createdAt?: string;
};

export type AuthSession = {
  accessToken: string;
  expiresAt: number;
};

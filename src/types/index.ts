// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  companyName?: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  userCode: string;
  emailVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  videoUrl?: string;
  featured: boolean;
  moq: number;
  exportHighlight: string;
  paymentTerms: string[];
  customizationNote: string;
  createdAt: Date;
}

export type ProductCategory =
  | 'Agricultural Products'
  | 'Spices & Herbs'
  | 'Textiles & Fabrics'
  | 'Handicrafts & Decor'
  | 'Food Products'
  | 'Leather Goods'
  | 'Gems & Jewelry'
  | 'Chemicals & Pharmaceuticals'
  | 'Machinery & Equipment'
  | 'Other';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Agricultural Products',
  'Spices & Herbs',
  'Textiles & Fabrics',
  'Handicrafts & Decor',
  'Food Products',
  'Leather Goods',
  'Gems & Jewelry',
  'Chemicals & Pharmaceuticals',
  'Machinery & Equipment',
  'Other',
];

// RFQ Types
export interface RFQ {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  user?: User;
  quantity: number;
  targetPrice?: string;
  country: string;
  message: string;
  status: RFQStatus;
  createdAt: Date;
}

export type RFQStatus = 'Pending' | 'In Discussion' | 'Closed';

// Message Types
export interface Message {
  id: string;
  rfqId: string;
  from: 'admin' | 'user';
  text: string;
  createdAt: Date;
}

// Contact Types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  country: string;
  message: string;
  createdAt: Date;
}

// Admin Session Types
export interface AdminSessionLog {
  id: string;
  email: string;
  loginAt: Date;
  logoutAt?: Date;
}

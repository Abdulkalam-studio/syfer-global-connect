// Database types that match our Supabase schema
export type AppRole = 'admin' | 'user';
export type RfqStatus = 'Pending' | 'In Discussion' | 'Closed';
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

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  phone: string;
  company_name: string | null;
  country: string;
  state: string;
  city: string;
  user_code: string;
  email_verified: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  short_description: string;
  full_description: string;
  images: string[];
  video_url: string | null;
  featured: boolean;
  moq: number;
  export_highlight: string;
  payment_terms: string[];
  customization_note: string;
  created_at: string;
  updated_at: string;
}

export interface RFQ {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  target_price: string | null;
  country: string;
  message: string;
  status: RfqStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  product?: Product;
  profile?: Profile;
}

export interface Message {
  id: string;
  rfq_id: string;
  sender_type: 'admin' | 'user';
  sender_id: string;
  text: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  country: string;
  message: string;
  created_at: string;
}

export interface AdminSessionLog {
  id: string;
  user_id: string;
  email: string;
  login_at: string;
  logout_at: string | null;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface EmailVerificationToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

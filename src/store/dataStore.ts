import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, RFQ, Message, ContactSubmission, User } from '@/types';
import { sampleProducts, sampleUsers, sampleRFQs, sampleMessages } from '@/data/sampleData';

interface DataStore {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUserData: (id: string, updates: Partial<User>) => void;

  // RFQs
  rfqs: RFQ[];
  addRFQ: (rfq: RFQ) => void;
  updateRFQ: (id: string, updates: Partial<RFQ>) => void;

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;

  // Contacts
  contacts: ContactSubmission[];
  addContact: (contact: ContactSubmission) => void;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      // Products
      products: sampleProducts,
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Users
      users: sampleUsers,
      addUser: (user) =>
        set((state) => ({ users: [...state.users, user] })),
      updateUserData: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...updates } : u
          ),
        })),

      // RFQs
      rfqs: sampleRFQs,
      addRFQ: (rfq) => set((state) => ({ rfqs: [...state.rfqs, rfq] })),
      updateRFQ: (id, updates) =>
        set((state) => ({
          rfqs: state.rfqs.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      // Messages
      messages: sampleMessages,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      // Contacts
      contacts: [],
      addContact: (contact) =>
        set((state) => ({ contacts: [...state.contacts, contact] })),
    }),
    {
      name: 'indian-exports-data',
    }
  )
);

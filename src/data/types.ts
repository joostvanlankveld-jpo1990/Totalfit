export type ClassCategory = 'cardio' | 'kracht' | 'mind-body' | 'senioren' | 'dans';

export interface ClassType {
  id: string;
  name: string;
  category: ClassCategory;
  description: string;
  intensity: 1 | 2 | 3;
  durationMin: number;
  color: string;
}

export interface ClassSession {
  id: string;
  classTypeId: string;
  start: string; // ISO
  durationMin: number;
  room: string;
  instructor: string;
  capacity: number;
  /** Aantal boekingen door andere leden (komt later uit de backend). */
  bookedByOthers: number;
}

export type ProductCategory = 'materiaal' | 'kleding' | 'voeding' | 'tegoed';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  priceCents: number;
  description: string;
  emoji: string;
  inStock: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  monthlyCents: number;
  signupFeeCents: number;
  perks: string[];
  highlight?: boolean;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  lines: { productId: string; name: string; quantity: number; unitCents: number }[];
  totalCents: number;
  paymentMethod: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  memberNumber: string;
}

export interface Membership {
  planId: string;
  startDate: string;
  status: 'actief' | 'in behandeling';
}

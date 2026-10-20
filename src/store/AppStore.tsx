import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { GYM, productById } from '../data/catalog';
import { CartLine, ClassSession, Membership, Order, User } from '../data/types';

const STORAGE_KEY = 'totalfit-state-v1';

interface State {
  hydrated: boolean;
  user: User | null;
  membership: Membership | null;
  bookings: string[];
  waitlist: string[];
  cart: CartLine[];
  orders: Order[];
}

const initialState: State = {
  hydrated: false,
  user: null,
  membership: null,
  bookings: [],
  waitlist: [],
  cart: [],
  orders: [],
};

type Action =
  | { type: 'hydrate'; state: Partial<State> }
  | { type: 'login'; user: User }
  | { type: 'logout' }
  | { type: 'setMembership'; membership: Membership }
  | { type: 'book'; id: string }
  | { type: 'cancel'; id: string }
  | { type: 'joinWaitlist'; id: string }
  | { type: 'leaveWaitlist'; id: string }
  | { type: 'setQty'; productId: string; quantity: number }
  | { type: 'placeOrder'; order: Order };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, hydrated: true };
    case 'login':
      return { ...state, user: action.user };
    case 'logout':
      return { ...initialState, hydrated: true, cart: state.cart };
    case 'setMembership':
      return { ...state, membership: action.membership };
    case 'book':
      return {
        ...state,
        bookings: [...new Set([...state.bookings, action.id])],
        waitlist: state.waitlist.filter((w) => w !== action.id),
      };
    case 'cancel':
      return { ...state, bookings: state.bookings.filter((b) => b !== action.id) };
    case 'joinWaitlist':
      return { ...state, waitlist: [...new Set([...state.waitlist, action.id])] };
    case 'leaveWaitlist':
      return { ...state, waitlist: state.waitlist.filter((w) => w !== action.id) };
    case 'setQty': {
      const rest = state.cart.filter((l) => l.productId !== action.productId);
      if (action.quantity <= 0) return { ...state, cart: rest };
      const existing = state.cart.find((l) => l.productId === action.productId);
      const line = { productId: action.productId, quantity: Math.min(action.quantity, 99) };
      return {
        ...state,
        cart: existing
          ? state.cart.map((l) => (l.productId === action.productId ? line : l))
          : [...state.cart, line],
      };
    }
    case 'placeOrder':
      return { ...state, cart: [], orders: [action.order, ...state.orders] };
  }
}

export type BookingStatus = 'geboekt' | 'wachtlijst' | 'vol' | 'beschikbaar' | 'voorbij';

function useStoreValue() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => dispatch({ type: 'hydrate', state: raw ? JSON.parse(raw) : {} }))
      .catch(() => dispatch({ type: 'hydrate', state: {} }));
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated, ...persisted } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persisted)).catch(() => {});
  }, [state]);

  const cartLines = useMemo(
    () =>
      state.cart
        .map((l) => {
          const product = productById(l.productId);
          return product ? { ...l, product, lineCents: product.priceCents * l.quantity } : null;
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [state.cart],
  );
  const cartTotalCents = cartLines.reduce((sum, l) => sum + l.lineCents, 0);
  const cartCount = cartLines.reduce((sum, l) => sum + l.quantity, 0);

  const spotsTaken = useCallback(
    (s: ClassSession) => s.bookedByOthers + (state.bookings.includes(s.id) ? 1 : 0),
    [state.bookings],
  );

  const statusFor = useCallback(
    (s: ClassSession): BookingStatus => {
      if (state.bookings.includes(s.id)) return 'geboekt';
      if (new Date(s.start).getTime() < Date.now()) return 'voorbij';
      if (state.waitlist.includes(s.id)) return 'wachtlijst';
      if (spotsTaken(s) >= s.capacity) return 'vol';
      return 'beschikbaar';
    },
    [state.bookings, state.waitlist, spotsTaken],
  );

  const canCancel = (s: ClassSession) =>
    new Date(s.start).getTime() - Date.now() > GYM.cancelHoursBefore * 3600000;

  return {
    ...state,
    cartLines,
    cartTotalCents,
    cartCount,
    spotsTaken,
    statusFor,
    canCancel,
    login: (user: User) => dispatch({ type: 'login', user }),
    logout: () => dispatch({ type: 'logout' }),
    setMembership: (membership: Membership) => dispatch({ type: 'setMembership', membership }),
    book: (id: string) => dispatch({ type: 'book', id }),
    cancel: (id: string) => dispatch({ type: 'cancel', id }),
    joinWaitlist: (id: string) => dispatch({ type: 'joinWaitlist', id }),
    leaveWaitlist: (id: string) => dispatch({ type: 'leaveWaitlist', id }),
    setQty: (productId: string, quantity: number) => dispatch({ type: 'setQty', productId, quantity }),
    addToCart: (productId: string) =>
      dispatch({
        type: 'setQty',
        productId,
        quantity: (state.cart.find((l) => l.productId === productId)?.quantity ?? 0) + 1,
      }),
    placeOrder: (paymentMethod: string) => {
      const order: Order = {
        id: `TF${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        lines: cartLines.map((l) => ({
          productId: l.productId,
          name: l.product.name,
          quantity: l.quantity,
          unitCents: l.product.priceCents,
        })),
        totalCents: cartTotalCents,
        paymentMethod,
      };
      dispatch({ type: 'placeOrder', order });
      return order;
    },
  };
}

type Store = ReturnType<typeof useStoreValue>;
const StoreContext = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreValue();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore moet binnen AppStoreProvider gebruikt worden');
  return ctx;
}

export function makeMemberNumber(): string {
  return String(100000 + Math.floor(Math.random() * 900000));
}

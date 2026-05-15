import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // the dish id
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  variant?: string; // e.g. "Termino Medio", "Con Suero"
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean; // Controls whether the checkout sheet is open
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, variant: string | undefined, delta: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.id === newItem.id && i.variant === newItem.variant && i.notes === newItem.notes
          );

          if (existingIndex >= 0) {
            // Update quantity if perfectly matches id, variant, and notes
            const updatedItems = [...state.items];
            const itemToUpdate = updatedItems[existingIndex];
            if (itemToUpdate) {
              itemToUpdate.quantity += newItem.quantity;
            }
            return { items: updatedItems, isOpen: true };
          }
          // Otherwise add as new
          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (id, variant) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.variant === variant)),
        }));
      },

      updateQuantity: (id, variant, delta) => {
        set((state) => {
          return {
            items: state.items.map((i) => {
              if (i.id === id && i.variant === variant) {
                const newQuantity = Math.max(1, i.quantity + delta);
                return { ...i, quantity: newQuantity };
              }
              return i;
            }),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      setIsOpen: (isOpen) => set({ isOpen }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "mt-cart-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state like isOpen
    }
  )
);

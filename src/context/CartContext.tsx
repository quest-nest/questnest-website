import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { ShopifyService } from '../services/shopifyService';
import type { ShopifyCart } from '../types/shopify';

interface CartState {
  cart: ShopifyCart | null;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: ShopifyCart }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

interface CartContextType extends CartState {
  addToCart: (variantId: string, quantity: number) => Promise<boolean>;
  createCart: () => Promise<boolean>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isLoading: false,
    error: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem('questnest_cart_id');
    if (savedCartId) {
      // In a real implementation, you'd fetch the cart by ID
      // For now, we'll create a new cart if needed
    }
  }, []);

  const createCart = async (): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const cart = await ShopifyService.createCart();
      if (cart) {
        dispatch({ type: 'SET_CART', payload: cart });
        localStorage.setItem('questnest_cart_id', cart.id);
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to create cart' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create cart' });
      return false;
    }
  };

  const addToCart = async (variantId: string, quantity: number): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Create cart if it doesn't exist
      if (!state.cart) {
        const cartCreated = await createCart();
        if (!cartCreated) return false;
      }

      if (state.cart) {
        const updatedCart = await ShopifyService.addToCart(state.cart.id, variantId, quantity);
        if (updatedCart) {
          dispatch({ type: 'SET_CART', payload: updatedCart });
          return true;
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
          return false;
        }
      }
      
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    createCart,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

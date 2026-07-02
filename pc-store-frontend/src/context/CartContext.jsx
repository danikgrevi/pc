// src/context/CartContext.jsx
import React, { createContext, useContext, useReducer } from 'react';
import cartService from '../services/cartService';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'ADD_ITEM':
      return { ...state, cart: action.payload, error: null };
    case 'UPDATE_ITEM':
      return { ...state, cart: action.payload, error: null };
    case 'REMOVE_ITEM':
      return { ...state, cart: action.payload, error: null };
    case 'CLEAR_CART':
      return { ...state, cart: null, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    loading: false,
    error: null
  });

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: response.data });
      return response;
    } catch (error) {
      const errorMessage = error?.error?.message || 'Ошибка при загрузке корзины';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      dispatch({ type: 'ADD_ITEM', payload: response.data });
      return response;
    } catch (error) {
      const errorMessage = error?.error?.message || 'Ошибка при добавлении в корзину';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        return removeFromCart(cartItemId);
      }
      const response = await cartService.updateCartItem(cartItemId, quantity);
      dispatch({ type: 'UPDATE_ITEM', payload: response.data });
      return response;
    } catch (error) {
      const errorMessage = error?.error?.message || 'Ошибка при обновлении корзины';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await cartService.removeFromCart(cartItemId);
      dispatch({ type: 'REMOVE_ITEM', payload: response.data });
      return response;
    } catch (error) {
      const errorMessage = error?.error?.message || 'Ошибка при удалении из корзины';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      return response;
    } catch (error) {
      const errorMessage = error?.error?.message || 'Ошибка при очистке корзины';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const value = {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
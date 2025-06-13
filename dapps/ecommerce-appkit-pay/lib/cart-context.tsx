'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CartItem, Product } from './types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

const CART_STORAGE_KEY = 'shopping-cart'

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, quantity } = action.payload
      const existingItemIndex = state.findIndex(
        item => item.product.id === product.id && item.size === size
      )

      if (existingItemIndex > -1) {
        const newState = [...state]
        newState[existingItemIndex].quantity += quantity
        return newState
      }

      return [...state, { product, size, quantity }]
    }
    case 'REMOVE_ITEM': {
      const { productId, size } = action.payload
      return state.filter(
        item => !(item.product.id === productId && item.size === size)
      )
    }
    case 'UPDATE_QUANTITY': {
      const { productId, size, quantity } = action.payload
      if (quantity <= 0) {
        return state.filter(
          item => !(item.product.id === productId && item.size === size)
        )
      }
      return state.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    }
    case 'CLEAR_CART':
      return []
    case 'LOAD_CART':
      return action.payload
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return // Don't save during initial load

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [items, isLoaded])

  const addItem = (product: Product, size: string, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, size, quantity } })
  }

  const removeItem = (productId: string, size: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } })
  }

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 
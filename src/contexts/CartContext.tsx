import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getOrCreateGuestId, clearGuestId } from '@/lib/guestId';
import { getRole } from '@/lib/auth';

interface CartItem {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  instructor: string;
  duration: string;
  level: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isInCart: (itemId: string) => boolean;
  transferCartToUser: (userId: string) => void;
  loadUserCart: (userId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [guestId] = useState(() => getOrCreateGuestId());

  // Load cart from localStorage on mount
  useEffect(() => {
    const role = getRole();
    let cartKey = 'videmy-cart';
    
    if (role === 'guest') {
      cartKey = `videmy-cart-${guestId}`;
    } else if (role === 'user') {
      // For logged in users, use a different key or load from server
      cartKey = 'videmy-cart-user';
    }
    
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, [guestId]);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    const role = getRole();
    let cartKey = 'videmy-cart';
    
    if (role === 'guest') {
      cartKey = `videmy-cart-${guestId}`;
    } else if (role === 'user') {
      cartKey = 'videmy-cart-user';
    }
    
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, guestId]);

  const addToCart = (item: CartItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        toast.info('Kursus sudah ada di keranjang');
        return prevItems;
      }
      toast.success('Kursus ditambahkan ke keranjang');
      return [...prevItems, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      toast.success('Kursus dihapus dari keranjang');
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Keranjang dikosongkan');
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const isInCart = (itemId: string) => {
    return items.some(item => item.id === itemId);
  };

  const transferCartToUser = (userId: string) => {
    const guestCartKey = `videmy-cart-${guestId}`;
    const guestCart = localStorage.getItem(guestCartKey);
    
    if (guestCart) {
      // Transfer guest cart to user cart
      localStorage.setItem('videmy-cart-user', guestCart);
      localStorage.removeItem(guestCartKey);
      
      // Clear guest ID since user is now logged in
      clearGuestId();
      
      toast.success('Keranjang berhasil dipindahkan ke akun Anda!');
    }
  };

  const loadUserCart = (userId: string) => {
    const userCart = localStorage.getItem('videmy-cart-user');
    if (userCart) {
      try {
        const userItems = JSON.parse(userCart);
        // Merge with existing items if any
        const mergedItems = [...items];
        
        userItems.forEach((userItem: CartItem) => {
          if (!mergedItems.find(item => item.id === userItem.id)) {
            mergedItems.push(userItem);
          }
        });
        
        setItems(mergedItems);
      } catch (error) {
        console.error('Error loading user cart:', error);
      }
    }
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    transferCartToUser,
    loadUserCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

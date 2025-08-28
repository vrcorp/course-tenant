import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getOrCreateGuestId, clearGuestId } from '@/lib/guestId';
import { getRole } from '@/lib/auth';

interface WishlistItem {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  rating: number;
  studentsCount?: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (itemId: string) => boolean;
  getTotalItems: () => number;
  transferWishlistToUser: (userId: string) => void;
  loadUserWishlist: (userId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [guestId] = useState(() => getOrCreateGuestId());

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const role = getRole();
    let wishlistKey = 'videmy-wishlist';
    
    if (role === 'guest') {
      wishlistKey = `videmy-wishlist-${guestId}`;
    } else if (role === 'user') {
      wishlistKey = 'videmy-wishlist-user';
    }
    
    const savedWishlist = localStorage.getItem(wishlistKey);
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, [guestId]);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    const role = getRole();
    let wishlistKey = 'videmy-wishlist';
    
    if (role === 'guest') {
      wishlistKey = `videmy-wishlist-${guestId}`;
    } else if (role === 'user') {
      wishlistKey = 'videmy-wishlist-user';
    }
    
    localStorage.setItem(wishlistKey, JSON.stringify(items));
  }, [items, guestId]);

  const addToWishlist = (item: WishlistItem) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        toast.info('Kursus sudah ada di wishlist!');
        return prevItems;
      }
      toast.success('Kursus ditambahkan ke wishlist!');
      return [...prevItems, item];
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== itemId);
      toast.success('Kursus dihapus dari wishlist!');
      return newItems;
    });
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem('videmy-wishlist');
    toast.success('Wishlist berhasil dikosongkan!');
  };

  const isInWishlist = (itemId: string) => {
    return items.some(item => item.id === itemId);
  };

  const getTotalItems = () => {
    return items.length;
  };

  const transferWishlistToUser = (userId: string) => {
    const guestWishlistKey = `videmy-wishlist-${guestId}`;
    const guestWishlist = localStorage.getItem(guestWishlistKey);
    
    if (guestWishlist) {
      // Transfer guest wishlist to user wishlist
      localStorage.setItem('videmy-wishlist-user', guestWishlist);
      localStorage.removeItem(guestWishlistKey);
      
      toast.success('Wishlist berhasil dipindahkan ke akun Anda!');
    }
  };

  const loadUserWishlist = (userId: string) => {
    const userWishlist = localStorage.getItem('videmy-wishlist-user');
    if (userWishlist) {
      try {
        const userItems = JSON.parse(userWishlist);
        // Merge with existing items if any
        const mergedItems = [...items];
        
        userItems.forEach((userItem: WishlistItem) => {
          if (!mergedItems.find(item => item.id === userItem.id)) {
            mergedItems.push(userItem);
          }
        });
        
        setItems(mergedItems);
      } catch (error) {
        console.error('Error loading user wishlist:', error);
      }
    }
  };

  const value: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getTotalItems,
    transferWishlistToUser,
    loadUserWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { getRole } from '@/lib/auth';

export const useGuestTransfer = () => {
  const { transferCartToUser, loadUserCart } = useCart();
  const { transferWishlistToUser, loadUserWishlist } = useWishlist();

  useEffect(() => {
    const handleRoleChange = () => {
      const role = getRole();
      
      // When user logs in (role changes from guest to user)
      if (role === 'user') {
        // Generate a mock user ID (in real app, this would come from auth context)
        const userId = 'user-' + Date.now();
        
        // Transfer guest cart and wishlist to user account
        transferCartToUser(userId);
        transferWishlistToUser(userId);
        
        // Load user's existing cart and wishlist
        loadUserCart(userId);
        loadUserWishlist(userId);
      }
    };

    // Listen for role changes
    window.addEventListener('vh_role_change', handleRoleChange);
    
    // Check initial role on mount
    handleRoleChange();

    return () => {
      window.removeEventListener('vh_role_change', handleRoleChange);
    };
  }, [transferCartToUser, transferWishlistToUser, loadUserCart, loadUserWishlist]);
};

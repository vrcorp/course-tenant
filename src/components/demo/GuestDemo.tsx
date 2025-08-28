import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, ShoppingCart, Heart, Info } from 'lucide-react';
import { getOrCreateGuestId } from '@/lib/guestId';
import { getRole } from '@/lib/auth';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const GuestDemo: React.FC = () => {
  const currentRole = getRole();
  const guestId = getOrCreateGuestId();
  const { getTotalItems: getCartItems } = useCart();
  const { getTotalItems: getWishlistItems } = useWishlist();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Status Pengguna
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Badge variant={currentRole === 'guest' ? 'secondary' : 'default'}>
            {currentRole === 'guest' ? 'Guest User' : `Logged in as ${currentRole}`}
          </Badge>
        </div>
        
        {currentRole === 'guest' && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Info className="h-4 w-4" />
              <span className="font-medium">Guest ID:</span>
            </div>
            <div className="text-xs text-blue-600 font-mono mt-1">
              {guestId}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Keranjang:</span>
          </div>
          <Badge variant="outline">{getCartItems()} item</Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-600" />
            <span className="text-sm">Wishlist:</span>
          </div>
          <Badge variant="outline">{getWishlistItems()} item</Badge>
        </div>

        {currentRole === 'guest' && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Info:</strong> Data keranjang dan wishlist Anda akan otomatis dipindahkan ke akun saat login.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuestDemo;

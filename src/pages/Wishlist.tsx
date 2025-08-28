import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  Star, 
  Clock, 
  Users, 
  ShoppingCart,
  Trash2,
  BookOpen,
  User,
  Info
} from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { getOrCreateGuestId } from '@/lib/guestId';
import { getRole } from '@/lib/auth';
import { toast } from 'sonner';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const currentRole = getRole();
  const guestId = getOrCreateGuestId();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const handleAddToCart = (item: any) => {
    const cartItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      thumbnail: item.thumbnail,
      instructor: item.instructor,
      duration: item.duration,
      level: item.level,
      category: item.category
    };
    addToCart(cartItem);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-600 mb-4">
              Wishlist Kosong
            </h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Anda belum menambahkan kursus apapun ke wishlist. Mulai jelajahi kursus menarik dan simpan yang Anda sukai!
            </p>
            <Link to="/courses">
              <Button size="lg">
                <BookOpen className="h-5 w-5 mr-2" />
                Jelajahi Kursus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Guest Info Alert */}
        {currentRole === 'guest' && items.length > 0 && (
          <Alert className="mb-6 border-pink-200 bg-pink-50">
            <Info className="h-4 w-4 text-pink-600" />
            <AlertDescription className="text-pink-800">
              <strong>Wishlist sebagai Guest:</strong> Wishlist Anda akan tersimpan dan dapat dipindahkan ke akun saat login nanti.
              <Link to="/login" className="ml-2 underline hover:no-underline">
                Login sekarang
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Wishlist Saya
            </h1>
            <p className="text-gray-600">
              {items.length} kursus tersimpan
            </p>
            {currentRole === 'guest' && (
              <div className="flex items-center gap-2 mt-2">
                <User className="h-4 w-4 text-pink-500" />
                <span className="text-sm text-pink-600 font-medium">
                  Guest ID: {guestId.split('_')[1]?.substring(0, 8)}...
                </span>
              </div>
            )}
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Kosongkan Wishlist
            </Button>
          )}
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link to={`/course/${item.id}`}>
                    {item.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                  oleh {item.instructor}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{(item.studentsCount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{item.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(item)}
                    disabled={isInCart(item.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInCart(item.id) ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

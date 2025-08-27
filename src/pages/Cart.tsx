import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

export default function Cart() {
  const { items, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateSavings = () => {
    return items.reduce((total, item) => {
      if (item.originalPrice) {
        return total + (item.originalPrice - item.price);
      }
      return total;
    }, 0);
  };

  const savings = calculateSavings();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link to="/courses">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Katalog
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
          </div>

          {/* Empty State */}
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Keranjang Anda Kosong
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Belum ada kursus yang ditambahkan ke keranjang. Jelajahi katalog kami dan temukan kursus yang menarik!
              </p>
              <div className="space-y-3">
                <Link to="/courses">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Jelajahi Kursus
                  </Button>
                </Link>
                <br />
                <Link to="/">
                  <Button variant="outline" size="lg">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/courses">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Katalog
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
              <p className="text-gray-600 mt-2">
                {getTotalItems()} kursus dalam keranjang Anda
              </p>
            </div>
            {savings > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Hemat</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(savings)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-6">
                    <div className="relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      {item.originalPrice && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{item.instructor}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{item.duration}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {item.level}
                            </Badge>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} kursus)</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Hemat</span>
                      <span>-{formatPrice(savings)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Admin</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <Link to="/checkout" className="block">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                      size="lg"
                    >
                      Lanjut ke Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link to="/courses" className="block">
                    <Button variant="outline" className="w-full" size="lg">
                      Lanjut Belanja
                    </Button>
                  </Link>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    💡 Akses seumur hidup untuk semua kursus
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Building2, 
  CheckCircle, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Ticket,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useTenantAuth } from '@/contexts/TenantAuthContext';
import checkoutData from '@/data/checkout.json';

interface Voucher {
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount: number;
  isActive: boolean;
  validUntil: string;
}

interface PaymentMethod {
  code: string;
  name: string;
  category: string;
  icon: string;
  fee: number;
  feeType: 'fixed' | 'percentage';
  isActive: boolean;
}

interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
  icon: string;
}

export default function Checkout() {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { getRole } = useTenantAuth();
  const navigate = useNavigate();
  const role = getRole();
  
  // Form states
  const [isGuest, setIsGuest] = useState(true);
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Payment states
  const [paymentType, setPaymentType] = useState<'tripay' | 'manual'>('tripay');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  
  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  
  // Success state
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);
  
  const vouchers: Voucher[] = checkoutData.vouchers;
  const tripayMethods: PaymentMethod[] = checkoutData.paymentMethods.tripay;
  const bankAccounts: BankAccount[] = checkoutData.paymentMethods.manual;
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  const calculateDiscount = () => {
    if (!appliedVoucher) return 0;
    
    const subtotal = getTotalPrice();
    if (subtotal < appliedVoucher.minPurchase) return 0;
    
    if (appliedVoucher.type === 'percentage') {
      const discount = (subtotal * appliedVoucher.value) / 100;
      return Math.min(discount, appliedVoucher.maxDiscount);
    } else {
      return Math.min(appliedVoucher.value, subtotal);
    }
  };
  
  const calculatePaymentFee = () => {
    if (paymentType === 'manual') return 0;
    
    const method = tripayMethods.find(m => m.code === selectedPayment);
    if (!method) return 0;
    
    const subtotal = getTotalPrice() - calculateDiscount();
    
    if (method.feeType === 'fixed') {
      return method.fee;
    } else {
      return (subtotal * method.fee) / 100;
    }
  };
  
  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const discount = calculateDiscount();
    const fee = calculatePaymentFee();
    return subtotal - discount + fee;
  };
  
  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error('Masukkan kode voucher');
      return;
    }
    
    setVoucherLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const voucher = vouchers.find(v => 
      v.code.toLowerCase() === voucherCode.trim().toLowerCase() && v.isActive
    );
    
    if (!voucher) {
      toast.error('Kode voucher tidak valid atau sudah kadaluarsa');
      setVoucherLoading(false);
      return;
    }
    
    if (getTotalPrice() < voucher.minPurchase) {
      toast.error(`Minimum pembelian ${formatPrice(voucher.minPurchase)} untuk voucher ini`);
      setVoucherLoading(false);
      return;
    }
    
    setAppliedVoucher(voucher);
    setVoucherCode('');
    setVoucherLoading(false);
    toast.success(`Voucher ${voucher.code} berhasil diterapkan!`);
  };
  
  const removeVoucher = () => {
    setAppliedVoucher(null);
    toast.success('Voucher dihapus');
  };
  
  const validateGuestData = () => {
    if (!guestData.name.trim()) {
      toast.error('Nama lengkap wajib diisi');
      return false;
    }
    if (!guestData.email.trim()) {
      toast.error('Email wajib diisi');
      return false;
    }
    if (!guestData.phone.trim()) {
      toast.error('Nomor telepon wajib diisi');
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestData.email)) {
      toast.error('Format email tidak valid');
      return false;
    }
    
    return true;
  };
  
  const processPayment = async () => {
    // Validate guest data
    if (isGuest && !validateGuestData()) {
      return;
    }
    
    // Validate payment method
    if (paymentType === 'tripay' && !selectedPayment) {
      toast.error('Pilih metode pembayaran');
      return;
    }
    
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrderId = `VDM-${Date.now()}`;
      setOrderId(newOrderId);
      
      // Generate payment instructions based on method
      if (paymentType === 'manual') {
        setPaymentInstructions({
          type: 'manual',
          bankAccounts,
          amount: getFinalTotal(),
          orderId: newOrderId
        });
      } else {
        const method = tripayMethods.find(m => m.code === selectedPayment);
        setPaymentInstructions({
          type: 'tripay',
          method,
          amount: getFinalTotal(),
          orderId: newOrderId,
          virtualAccount: method?.category === 'Virtual Account' ? `8808${newOrderId.slice(-6)}` : null,
          qrCode: method?.code === 'QRIS' ? `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==` : null
        });
      }
      
      setOrderSuccess(true);
      clearCart();
      toast.success('Pesanan berhasil dibuat!');
      
    } catch (error) {
      toast.error('Terjadi kesalahan saat memproses pembayaran');
    } finally {
      setProcessing(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Disalin ke clipboard');
  };
  
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Pesanan Berhasil Dibuat!
              </h1>
              <p className="text-gray-600 mb-8">
                Terima kasih! Pesanan Anda dengan ID <strong>{orderId}</strong> telah berhasil dibuat.
              </p>
              
              {paymentInstructions && (
                <div className="max-w-2xl mx-auto mb-8">
                  {paymentInstructions.type === 'manual' ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          Instruksi Transfer Manual
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-left">
                          <p className="text-sm text-gray-600 mb-4">
                            Silakan transfer ke salah satu rekening berikut:
                          </p>
                          {paymentInstructions.bankAccounts.map((bank: BankAccount, index: number) => (
                            <div key={index} className="border rounded-lg p-4 mb-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{bank.bank}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => copyToClipboard(bank.accountNumber)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600">{bank.accountName}</p>
                              <p className="font-mono text-lg">{bank.accountNumber}</p>
                            </div>
                          ))}
                          <div className="bg-blue-50 p-4 rounded-lg mt-4">
                            <p className="font-semibold text-blue-900">Total Transfer:</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatPrice(paymentInstructions.amount)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Instruksi Pembayaran {paymentInstructions.method?.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {paymentInstructions.virtualAccount && (
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Nomor Virtual Account:</p>
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-mono text-2xl font-bold">
                                {paymentInstructions.virtualAccount}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyToClipboard(paymentInstructions.virtualAccount)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="font-semibold text-blue-900">Total Pembayaran:</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(paymentInstructions.amount)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/courses')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Lanjut Jelajahi Kursus
                </Button>
                <br />
                <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                  Kembali ke Beranda
                </Button>
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
          <Link to="/cart">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Keranjang
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Lengkapi data dan pilih metode pembayaran untuk menyelesaikan pesanan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="guest"
                    checked={isGuest}
                    onChange={() => setIsGuest(true)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="guest">Checkout sebagai Tamu</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="member"
                    checked={!isGuest}
                    onChange={() => setIsGuest(false)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="member">Login/Daftar Akun</Label>
                </div>
                
                {isGuest ? (
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        value={guestData.name}
                        onChange={(e) => setGuestData({...guestData, name: e.target.value})}
                        placeholder="Masukkan nama lengkap"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestData.email}
                        onChange={(e) => setGuestData({...guestData, email: e.target.value})}
                        placeholder="contoh@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <Input
                        id="phone"
                        value={guestData.phone}
                        onChange={(e) => setGuestData({...guestData, phone: e.target.value})}
                        placeholder="08xxxxxxxxxx"
                        className="mt-1"
                      />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700">
                        💡 Dengan checkout sebagai tamu, Anda akan menerima email konfirmasi dan akses ke kursus yang dibeli.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Silakan login atau daftar untuk melanjutkan</p>
                    <div className="space-x-3">
                      <Button onClick={() => navigate('/login')}>Login</Button>
                      <Button variant="outline" onClick={() => navigate('/register')}>Daftar</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            {isGuest && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Metode Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentType} onValueChange={(value) => setPaymentType(value as 'tripay' | 'manual')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="tripay">Pembayaran Online</TabsTrigger>
                      <TabsTrigger value="manual">Transfer Manual</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tripay" className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        Pilih metode pembayaran online yang tersedia:
                      </div>
                      
                      <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                        {/* Virtual Account */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Virtual Account</h4>
                          {tripayMethods.filter(m => m.category === 'Virtual Account').map((method) => (
                            <div key={method.code} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                              <RadioGroupItem value={method.code} id={method.code} />
                              <img src={method.icon} alt={method.name} className="w-8 h-8 object-contain" />
                              <div className="flex-1">
                                <Label htmlFor={method.code} className="font-medium">{method.name}</Label>
                                <p className="text-sm text-gray-500">
                                  Biaya: {method.feeType === 'fixed' ? formatPrice(method.fee) : `${method.fee}%`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* E-Wallet */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">E-Wallet</h4>
                          {tripayMethods.filter(m => m.category === 'E-Wallet').map((method) => (
                            <div key={method.code} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                              <RadioGroupItem value={method.code} id={method.code} />
                              <img src={method.icon} alt={method.name} className="w-8 h-8 object-contain" />
                              <div className="flex-1">
                                <Label htmlFor={method.code} className="font-medium">{method.name}</Label>
                                <p className="text-sm text-gray-500">
                                  Biaya: {method.feeType === 'fixed' ? formatPrice(method.fee) : `${method.fee}%`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Convenience Store */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Convenience Store</h4>
                          {tripayMethods.filter(m => m.category === 'Convenience Store').map((method) => (
                            <div key={method.code} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                              <RadioGroupItem value={method.code} id={method.code} />
                              <img src={method.icon} alt={method.name} className="w-8 h-8 object-contain" />
                              <div className="flex-1">
                                <Label htmlFor={method.code} className="font-medium">{method.name}</Label>
                                <p className="text-sm text-gray-500">
                                  Biaya: {method.feeType === 'fixed' ? formatPrice(method.fee) : `${method.fee}%`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </TabsContent>
                    
                    <TabsContent value="manual" className="space-y-4">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Transfer Manual</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Setelah checkout, Anda akan mendapat instruksi transfer ke rekening bank kami. 
                              Konfirmasi pembayaran akan diproses dalam 1x24 jam setelah transfer diterima.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Rekening Tujuan</h4>
                        {bankAccounts.map((bank, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <img src={bank.icon} alt={bank.bank} className="w-8 h-8 object-contain" />
                            <div className="flex-1">
                              <p className="font-medium">{bank.bank}</p>
                              <p className="text-sm text-gray-600">{bank.accountName}</p>
                              <p className="font-mono text-sm">{bank.accountNumber}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">
                          💡 Transfer ke salah satu rekening di atas dengan nominal yang tepat sesuai total pembayaran.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Course Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-gray-600">{item.instructor}</p>
                        <p className="font-semibold text-blue-600">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Voucher Section */}
                <div className="space-y-3">
                  <Label>Kode Voucher</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Masukkan kode voucher"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      disabled={voucherLoading}
                    />
                    <Button 
                      onClick={applyVoucher} 
                      disabled={voucherLoading || !voucherCode.trim()}
                      size="sm"
                    >
                      {voucherLoading ? 'Loading...' : 'Terapkan'}
                    </Button>
                  </div>
                  
                  {appliedVoucher && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">{appliedVoucher.code}</p>
                          <p className="text-sm text-green-600">{appliedVoucher.description}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={removeVoucher}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} kursus)</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  {appliedVoucher && calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon Voucher</span>
                      <span>-{formatPrice(calculateDiscount())}</span>
                    </div>
                  )}
                  
                  {calculatePaymentFee() > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Biaya Admin</span>
                      <span>{formatPrice(calculatePaymentFee())}</span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(getFinalTotal())}
                  </span>
                </div>
                
                {/* Checkout Button */}
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                  onClick={processPayment}
                  disabled={processing || (!isGuest && true) || (paymentType === 'tripay' && !selectedPayment)}
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Memproses...
                    </div>
                  ) : (
                    `Bayar ${formatPrice(getFinalTotal())}`
                  )}
                </Button>
                
                <div className="text-center pt-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Pembayaran aman dan terenkripsi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
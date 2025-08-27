import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  Play, 
  Award, 
  CheckCircle, 
  ShoppingCart, 
  CreditCard,
  ArrowLeft,
  Globe,
  Download,
  Smartphone,
  Monitor,
  MessageCircle,
  Share2,
  Heart,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import coursesData from '@/data/courses.json';

interface CourseDetailProps {}

const CourseDetail: React.FC<CourseDetailProps> = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Find the course from the JSON data
  const course = coursesData.courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Kursus Tidak Ditemukan
            </h2>
            <p className="text-gray-500 mb-4">
              Maaf, kursus yang Anda cari tidak dapat ditemukan.
            </p>
            <Link to="/courses">
              <Button>Kembali ke Katalog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const discount = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  // Button handlers
  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    const cartItem = {
      id: course.id,
      title: course.title,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      instructor: course.instructor.name,
      duration: course.duration || 'Lifetime access',
      level: course.level || 'All Levels',
      category: course.category
    };
    addToCart(cartItem);
    toast.success('Kursus ditambahkan ke keranjang!');
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: course.id,
      title: course.title,
      price: course.price,
      originalPrice: course.originalPrice,
      thumbnail: course.thumbnail,
      instructor: course.instructor.name,
      duration: course.duration || 'Lifetime access',
      level: course.level || 'All Levels',
      category: course.category
    };
    addToCart(cartItem);
    toast.success('Kursus berhasil ditambahkan ke keranjang!');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success('Kursus ditambahkan ke wishlist!');
    } else {
      toast.info('Kursus dihapus dari wishlist.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: course.title,
      text: `Lihat kursus ${course.title} oleh ${course.instructor.name}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Kursus berhasil dibagikan!');
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link kursus berhasil disalin ke clipboard!');
      } catch (error) {
        toast.error('Gagal menyalin link kursus.');
      }
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
    toast.info('Menampilkan preview kursus...');
    // In a real app, this would open a video player or preview modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="full-bleed">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/courses">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <span>Kursus</span>
                <span>•</span>
                <span>{course.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.featured && (
                      <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>
                    )}
                    {course.bestseller && (
                      <Badge className="bg-orange-500 text-white">Bestseller</Badge>
                    )}
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  
                  <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                  <p className="text-xl text-blue-100 mb-6">{course.description}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= course.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{course.rating}</span>
                      <span className="opacity-80">({course.reviews} ulasan)</span>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-80">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} siswa</span>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-80">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-80">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} pelajaran</span>
                    </div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">Instruktur: {course.instructor.name}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.instructor.rating} rating instruktur</span>
                    </div>
                    <p className="text-blue-100 text-sm">{course.instructor.bio}</p>
                  </div>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardContent className="p-0">
                    {/* Video Preview */}
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Button size="lg" variant="secondary" onClick={handlePreview}>
                          <Play className="h-6 w-6 mr-2" />
                          Preview Kursus
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Price */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {formatPrice(course.price)}
                        </div>
                        {course.originalPrice && (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(course.originalPrice)}
                            </span>
                            <Badge className="bg-red-500 text-white">
                              {discount}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                          size="lg"
                          onClick={handleBuyNow}
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Beli Sekarang
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          size="lg"
                          onClick={handleAddToCart}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Tambah ke Keranjang
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1"
                            onClick={handleWishlist}
                          >
                            <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                            Wishlist
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1"
                            onClick={handleShare}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Bagikan
                          </Button>
                        </div>
                      </div>

                      {/* Course Includes */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Kursus ini termasuk:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-gray-500" />
                            <span>Akses seumur hidup</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-gray-500" />
                            <span>Akses mobile dan desktop</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-gray-500" />
                            <span>Materi dapat diunduh</span>
                          </div>
                          {course.certificate && (
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              <span>Sertifikat penyelesaian</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-gray-500" />
                            <span>Forum diskusi</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
            <TabsTrigger value="instructor">Instruktur</TabsTrigger>
            <TabsTrigger value="reviews">Ulasan</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* What you'll learn */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Yang Akan Anda Pelajari
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.skills.map((skill, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Persyaratan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />
                          <span className="text-sm">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Fitur Kursus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Statistik Kursus</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level</span>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durasi</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pelajaran</span>
                      <span className="font-medium">{course.lessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Siswa</span>
                      <span className="font-medium">{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bahasa</span>
                      <span className="font-medium">Bahasa Indonesia</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sertifikat</span>
                      <span className="font-medium">{course.certificate ? 'Ya' : 'Tidak'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle>Kurikulum Kursus</CardTitle>
                <p className="text-gray-600">
                  {course.lessons} pelajaran • {course.duration} total
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock curriculum sections */}
                  {[
                    {
                      title: "Pengenalan dan Setup",
                      lessons: 4,
                      duration: "45 menit",
                      items: [
                        "Selamat datang di kursus",
                        "Setup environment development",
                        "Pengenalan tools yang digunakan",
                        "Project pertama"
                      ]
                    },
                    {
                      title: "Konsep Dasar",
                      lessons: 6,
                      duration: "1 jam 30 menit",
                      items: [
                        "Konsep fundamental",
                        "Best practices",
                        "Common patterns",
                        "Hands-on practice",
                        "Quiz: Konsep dasar",
                        "Assignment: Project mini"
                      ]
                    },
                    {
                      title: "Implementasi Lanjutan",
                      lessons: 8,
                      duration: "2 jam 15 menit",
                      items: [
                        "Advanced concepts",
                        "Real-world examples",
                        "Performance optimization",
                        "Testing strategies",
                        "Deployment",
                        "Monitoring",
                        "Quiz: Advanced topics",
                        "Final project"
                      ]
                    }
                  ].map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border rounded-lg">
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{section.title}</h3>
                          <span className="text-sm text-gray-600">
                            {section.lessons} pelajaran • {section.duration}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-3 py-2">
                            <Play className="h-4 w-4 text-gray-400" />
                            <span className="flex-1">{item}</span>
                            <span className="text-sm text-gray-500">
                              {Math.floor(Math.random() * 15) + 5} menit
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructor Tab */}
          <TabsContent value="instructor">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">{course.instructor.name}</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.instructor.rating}</span>
                        <span className="text-gray-600">rating instruktur</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">50+</div>
                        <div className="text-sm text-gray-600">Kursus</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">10K+</div>
                        <div className="text-sm text-gray-600">Siswa</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">5+</div>
                        <div className="text-sm text-gray-600">Tahun</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">4.8</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Ulasan Siswa</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{course.rating}</span>
                  </div>
                  <span className="text-gray-600">({course.reviews} ulasan)</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Rating breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm w-8">{rating} ⭐</span>
                          <Progress 
                            value={rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1} 
                            className="flex-1 h-2" 
                          />
                          <span className="text-sm text-gray-600 w-12">
                            {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample reviews */}
                  <div className="space-y-4">
                    {[
                      {
                        name: "Ahmad Rizki",
                        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                        rating: 5,
                        date: "2 minggu lalu",
                        comment: "Kursus yang sangat bagus! Materi dijelaskan dengan sangat detail dan mudah dipahami. Instruktur sangat berpengalaman dan responsif dalam menjawab pertanyaan."
                      },
                      {
                        name: "Sari Dewi",
                        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
                        rating: 5,
                        date: "1 bulan lalu",
                        comment: "Sangat recommended! Project-based learning yang membuat saya bisa langsung praktek. Sekarang saya sudah bisa membuat aplikasi sendiri."
                      },
                      {
                        name: "Budi Santoso",
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
                        rating: 4,
                        date: "1 bulan lalu",
                        comment: "Kursus yang bagus, tapi mungkin bisa ditambahkan lebih banyak contoh real-world case. Overall sangat puas dengan materinya."
                      }
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex gap-4">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{review.name}</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      question: "Apakah saya mendapat akses seumur hidup?",
                      answer: "Ya, setelah membeli kursus ini Anda akan mendapat akses seumur hidup ke semua materi kursus, termasuk update materi di masa depan."
                    },
                    {
                      question: "Apakah ada sertifikat setelah menyelesaikan kursus?",
                      answer: "Ya, Anda akan mendapat sertifikat digital setelah menyelesaikan semua materi dan lulus quiz akhir dengan nilai minimal 80%."
                    },
                    {
                      question: "Bagaimana jika saya tidak puas dengan kursus ini?",
                      answer: "Kami menyediakan garansi 30 hari uang kembali. Jika dalam 30 hari pertama Anda tidak puas, kami akan mengembalikan uang Anda 100%."
                    },
                    {
                      question: "Apakah saya bisa mengakses kursus dari mobile?",
                      answer: "Ya, platform kami fully responsive dan Anda bisa mengakses kursus dari smartphone, tablet, atau komputer kapan saja dan dimana saja."
                    },
                    {
                      question: "Apakah ada forum diskusi untuk bertanya?",
                      answer: "Ya, setiap kursus memiliki forum diskusi dimana Anda bisa bertanya dan berdiskusi dengan instruktur dan sesama siswa."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;

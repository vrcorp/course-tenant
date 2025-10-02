import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle as MessageCircleIcon,
  Mail,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Skeleton } from '@/components/ui/skeleton';
import { isServer } from '@tanstack/react-query';

// TypeScript interfaces
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  coursesCount: number;
  students: number;
  rating: number;
  status: string;
  joinDate: string;
  role?: string;
  title?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  type: string;
  order: number;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Testimonial {
  id: string;
  name: string;
  title: string;
  avatar: string;
  quote: string;
  rating: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface CourseStats {
  totalSections: number;
  totalLessons: number;
  totalTestimonials: number;
  averageTestimonialRating: number;
  totalQuizzes: number;
  totalFaqs: number;
  totalInstructors: number;
  totalCategories: number;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  discount: number;
  affiliateFee: number;
  level: string;
  language: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  lastUpdated: string;
  certificate: boolean;
  featured: boolean;
  bestseller: boolean;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  Category: Category;
  instructors: Instructor[];
  instructor: Instructor;
  features: string[];
  skills: string[];
  requirements: string[];
  curriculum: any[];
  sections: Section[];
  testimonials: Testimonial[];
  quizzes: any[];
  faqs: FAQ[];
  stats: CourseStats;
}

interface CourseDetailResponse {
  success: boolean;
  data: Course;
  message: string;
}

interface CourseDetailProps {}

const CourseDetail: React.FC<CourseDetailProps> = () => {
  // Add CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slide-in-left {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes slide-in-right {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }
      
      @keyframes pulse-scale {
        0%, 100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.8;
        }
      }
      
      .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
        opacity: 0;
      }
      
      .animate-slide-in-left {
        animation: slide-in-left 0.6s ease-out forwards;
        opacity: 0;
      }
      
      .animate-slide-in-right {
        animation: slide-in-right 0.6s ease-out forwards;
        opacity: 0;
      }
      
      .animate-shimmer {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200px 100%;
        animation: shimmer 1.5s infinite;
      }
      
      .animate-pulse-scale {
        animation: pulse-scale 2s ease-in-out infinite;
      }
      
      .dark .animate-shimmer {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200px 100%;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API Fetching Function
  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const baseUrl = isServer
        ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/"
        : "http://localhost:3000/api/";
      const tenantId = isServer
        ? process.env.NEXT_TENANT_ID || "tenant-1"
        : "tenant-1";
      
      const response = await fetch(`${baseUrl}courses/${courseId}`, {
        method: "GET",
        headers: {
          "x-tenant-id": tenantId,
          "Content-Type": "application/json",
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        cache: "no-store",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Kursus tidak ditemukan');
        }
        throw new Error('Gagal memuat data kursus');
      }
      
      const data: CourseDetailResponse = await response.json();
      setCourse(data.data);
      
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data kursus');
    } finally {
      setIsLoading(false);
    }
  };

  // Load course data on component mount and when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Skeleton Components
  const HeaderSkeleton = () => (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-10 w-24 bg-white/20 rounded animate-shimmer" />
          <div className="h-4 w-32 bg-white/20 rounded animate-shimmer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-white/20 rounded animate-shimmer" />
                <div className="h-6 w-24 bg-white/20 rounded animate-shimmer" />
              </div>
              <div className="h-12 w-3/4 bg-white/20 rounded animate-shimmer" />
              <div className="h-6 w-full bg-white/20 rounded animate-shimmer" />
              <div className="h-6 w-2/3 bg-white/20 rounded animate-shimmer" />
              
              <div className="flex gap-6">
                <div className="h-4 w-24 bg-white/20 rounded animate-shimmer" />
                <div className="h-4 w-20 bg-white/20 rounded animate-shimmer" />
                <div className="h-4 w-16 bg-white/20 rounded animate-shimmer" />
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 rounded-lg p-4">
              <div className="w-16 h-16 bg-white/20 rounded-full animate-shimmer" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-white/20 rounded animate-shimmer" />
                <div className="h-4 w-32 bg-white/20 rounded animate-shimmer" />
                <div className="h-3 w-40 bg-white/20 rounded animate-shimmer" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-shimmer" />
              <div className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-shimmer" />
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-shimmer" />
                </div>
                <div className="space-y-3">
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                  <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                  <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                    <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TabsSkeleton = () => (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" style={{ animationDelay: `${i * 0.1 + 0.2}s` }} />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" style={{ animationDelay: `${i * 0.1 + 0.3}s` }} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" style={{ animationDelay: `${i * 0.05}s` }} />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" style={{ animationDelay: `${i * 0.05 + 0.1}s` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="full-bleed">
          <HeaderSkeleton />
        </div>
        <TabsSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg inline-block mb-4">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">Gagal Memuat Kursus</p>
            <p>{error}</p>
          </div>
          <div className="space-x-4">
            <Button onClick={fetchCourse} className="mt-4">
              Coba Lagi
            </Button>
            <Button variant="outline" onClick={() => navigate('/courses')} className="mt-4">
              Kembali ke Daftar Kursus
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No course found
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Kursus tidak ditemukan
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            Kursus yang Anda cari tidak tersedia atau telah dihapus
          </p>
          <Button onClick={() => navigate('/courses')}>
            Kembali ke Daftar Kursus
          </Button>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-500 mb-4">
              {error}
            </p>
            <Link to="/courses">
              <Button>Kembali ke Katalog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This check is now handled in the error state above

  // Utility functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Calculate discount percentage
  const discount = course.discount || (course.originalPrice && course.originalPrice > course.price 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0);

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
      duration: course.duration,
      level: course.level,
      category: course.Category?.name || 'Uncategorized'
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
      duration: course.duration,
      level: course.level,
      category: course.Category?.name || 'Uncategorized'
    };
    addToCart(cartItem);
    toast.success('Kursus berhasil ditambahkan ke keranjang!');
  };

  const handleWishlist = () => {
    if (isInWishlist(course.id)) {
      removeFromWishlist(course.id);
      toast.success('Kursus dihapus dari wishlist');
    } else {
      const wishlistItem = {
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail,
        price: course.price,
        originalPrice: course.originalPrice,
        instructor: course.instructor.name,
        duration: course.duration,
        level: course.level,
        category: course.Category?.name || 'Uncategorized',
        rating: course.rating,
        studentsCount: course.students
      };
      addToWishlist(wishlistItem);
      toast.success('Kursus ditambahkan ke wishlist');
    }
  };

  const handleShare = (platform?: string) => {
    const courseUrl = `${window.location.origin}/course/${course.id}`;
    const shareText = `Lihat kursus menarik ini: ${course.title}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + courseUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(courseUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(courseUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(course.title)}&body=${encodeURIComponent(shareText + '\n\n' + courseUrl)}`, '_blank');
        break;
      case 'copy':
      default:
        navigator.clipboard.writeText(courseUrl);
        toast.success('Link berhasil disalin ke clipboard!');
        break;
    }
    
    setShowShareMenu(false);
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
            <div className="flex items-center gap-4 mb-6 animate-fade-in">
              <Link to="/courses">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <span>Kursus</span>
                <span>•</span>
                <span>{course.Category?.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2 space-y-6 animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
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
                              star <= (course.rating || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{course.rating || 'Belum ada rating'}</span>
                      <span className="opacity-80">({course.testimonials?.length || 0} ulasan)</span>
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
                    <p className="text-blue-100 text-sm">{course.instructor.specialization}</p>
                    <p className="text-blue-100 text-xs">{course.instructor.coursesCount} kursus • {formatNumber(course.instructor.students)} siswa</p>
                  </div>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="lg:col-span-1 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
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
                            <Heart className={`h-4 w-4 mr-2 ${isInWishlist(course.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            Wishlist
                          </Button>
                          <DropdownMenu open={showShareMenu} onOpenChange={setShowShareMenu}>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex-1"
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Bagikan
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                              <DropdownMenuItem onClick={() => handleShare('copy')}>
                                <Copy className="mr-2 h-4 w-4" />
                                <span>Salin Link</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
                                <MessageCircleIcon className="mr-2 h-4 w-4 text-green-600" />
                                <span>WhatsApp</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare('facebook')}>
                                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                                <span>Facebook</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare('twitter')}>
                                <Twitter className="mr-2 h-4 w-4 text-sky-500" />
                                <span>Twitter</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                                <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                                <span>LinkedIn</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare('telegram')}>
                                <MessageCircle className="mr-2 h-4 w-4 text-blue-400" />
                                <span>Telegram</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare('email')}>
                                <Mail className="mr-2 h-4 w-4 text-gray-600" />
                                <span>Email</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
      <div className="max-w-7xl mx-auto p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
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
                <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
                <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
                <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
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
                <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
                      <span className="font-medium">{course.language === 'English' ? 'Bahasa Inggris' : course.language}</span>
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
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Kurikulum Kursus</CardTitle>
                <p className="text-gray-600">
                  {course.stats?.totalLessons || course.lessons} pelajaran • {course.duration} total
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.sections && course.sections.length > 0 ? (
                    course.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="border rounded-lg animate-fade-in" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
                        <div className="p-4 bg-gray-50 border-b">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{section.title}</h3>
                            <span className="text-sm text-gray-600">
                              {section.lessons.length} pelajaran
                            </span>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center gap-3 py-2">
                              <Play className="h-4 w-4 text-gray-400" />
                              <span className="flex-1">{lesson.title}</span>
                              <span className="text-sm text-gray-500">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback for courses without sections data
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Kurikulum akan segera tersedia</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Instructor Tab */}
          <TabsContent value="instructor">
            <Card className="animate-fade-in">
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
                      <p className="text-lg text-gray-600 mb-2">{course.instructor.specialization}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.instructor.rating}</span>
                        <span className="text-gray-600">rating instruktur</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">
                      Instruktur berpengalaman dengan spesialisasi di bidang {course.instructor.specialization}. 
                      Bergabung sejak {new Date(course.instructor.joinDate).getFullYear()} dan telah mengajar ribuan siswa.
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{course.instructor.coursesCount}</div>
                        <div className="text-sm text-gray-600">Kursus</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{formatNumber(course.instructor.students)}</div>
                        <div className="text-sm text-gray-600">Siswa</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{new Date().getFullYear() - new Date(course.instructor.joinDate).getFullYear()}+</div>
                        <div className="text-sm text-gray-600">Tahun</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{course.instructor.rating}</div>
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
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Ulasan Siswa</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{course.stats?.averageTestimonialRating || course.rating || 0}</span>
                  </div>
                  <span className="text-gray-600">({course.stats?.totalTestimonials || course.testimonials?.length || 0} ulasan)</span>
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

                  {/* Real testimonials */}
                  <div className="space-y-4">
                    {course.testimonials && course.testimonials.length > 0 ? (
                      course.testimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className="border-b pb-4 last:border-b-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="flex gap-4">
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{testimonial.name}</span>
                                <span className="text-sm text-gray-500">{testimonial.title}</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= Math.floor(testimonial.rating)
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{testimonial.rating}</span>
                              </div>
                              <p className="text-gray-700">{testimonial.quote}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada ulasan untuk kursus ini</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.faqs && course.faqs.length > 0 ? (
                    course.faqs.map((faq, index) => (
                      <div key={faq.id} className="border rounded-lg p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>FAQ akan segera tersedia</p>
                    </div>
                  )}
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

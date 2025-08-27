import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  ShoppingCart, 
  CreditCard,
  Play,
  Award,
  Globe,
  Smartphone,
  Database,
  Palette,
  TrendingUp,
  Shield
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import coursesData from '@/data/courses.json';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    rating: number;
  };
  thumbnail: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  reviews: number;
  price: {
    current: number;
    original?: number;
  };
  features: string[];
  skills: string[];
  requirements: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  certificate: boolean;
}

const Katalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [cart, setCart] = useState<string[]>([]);

  const courses: Course[] = coursesData.courses;
  const categories = coursesData.categories;

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'Web Development': <Globe className="h-5 w-5" />,
    'Mobile Development': <Smartphone className="h-5 w-5" />,
    'Data Science': <Database className="h-5 w-5" />,
    'UI/UX Design': <Palette className="h-5 w-5" />,
    'Business & Marketing': <TrendingUp className="h-5 w-5" />,
    'Cybersecurity': <Shield className="h-5 w-5" />
  };

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price.current - b.price.current;
        case 'price-high':
          return b.price.current - a.price.current;
        case 'newest':
          return 0; // Would sort by creation date in real app
        case 'popular':
        default:
          return b.students - a.students;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedCategory, selectedLevel, sortBy]);

  const addToCart = (courseId: string) => {
    setCart(prev => [...prev, courseId]);
  };

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(id => id !== courseId));
  };

  const buyNow = (courseId: string) => {
    // In real app, this would redirect to checkout
    console.log('Buying course:', courseId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Katalog Kursus
          </h1>
          <p className="text-gray-600 text-lg">
            Temukan kursus yang tepat untuk mengembangkan skill Anda
          </p>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari kursus, instruktur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Level</SelectItem>
                  <SelectItem value="Beginner">Pemula</SelectItem>
                  <SelectItem value="Intermediate">Menengah</SelectItem>
                  <SelectItem value="Advanced">Lanjutan</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Terpopuler</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                  <SelectItem value="newest">Terbaru</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Semua
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.name)}
              className="flex items-center gap-2"
            >
              {categoryIcons[category.name]}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-gray-600">
          Menampilkan {filteredAndSortedCourses.length} kursus
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button size="sm" variant="secondary">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {course.isFeatured && (
                    <Badge className="bg-yellow-500 text-yellow-900">Featured</Badge>
                  )}
                  {course.isBestseller && (
                    <Badge className="bg-orange-500 text-white">Bestseller</Badge>
                  )}
                </div>

                {/* Price */}
                <div className="absolute top-3 right-3 bg-white rounded-lg px-2 py-1">
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {formatPrice(course.price.current)}
                    </div>
                    {course.price.original && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatPrice(course.price.original)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Course Info */}
                <div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm">{course.instructor.name}</div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{course.instructor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons} pelajaran</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
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
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-gray-600">({course.reviews})</span>
                  </div>
                  
                  {course.certificate && (
                    <Badge variant="outline" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Sertifikat
                    </Badge>
                  )}
                </div>

                {/* Level and Category */}
                <div className="flex gap-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {cart.includes(course.id) ? (
                    <Button
                      variant="outline"
                      onClick={() => removeFromCart(course.id)}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Hapus dari Keranjang
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => addToCart(course.id)}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Tambah ke Keranjang
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => buyNow(course.id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Beli Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedCourses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Tidak ada kursus yang ditemukan
              </h3>
              <p className="text-gray-500 mb-4">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                variant="outline"
              >
                Reset Filter
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Shopping Cart Summary */}
        {cart.length > 0 && (
          <Card className="fixed bottom-6 right-6 w-80 shadow-2xl border-2 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingCart className="h-5 w-5" />
                Keranjang ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                {cart.slice(0, 3).map((courseId) => {
                  const course = courses.find(c => c.id === courseId);
                  return course ? (
                    <div key={courseId} className="flex justify-between items-center text-sm">
                      <span className="truncate flex-1 mr-2">{course.title}</span>
                      <span className="font-medium">{formatPrice(course.price.current)}</span>
                    </div>
                  ) : null;
                })}
                {cart.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{cart.length - 3} kursus lainnya
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  Lihat Keranjang
                </Button>
                <Button className="flex-1" size="sm">
                  Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Katalog;

import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Clock, 
  Star, 
  Users, 
  Search, 
  Filter, 
  Play, 
  Award, 
  Grid3X3, 
  List,
  SlidersHorizontal,
  Code,
  Smartphone,
  BarChart3,
  Palette,
  TrendingUp,
  Shield,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { isServer } from '@tanstack/react-query';

// TypeScript interfaces
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
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
  level: string;
  language: string;
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  reviews: number;
  featured: boolean;
  bestseller: boolean;
  certificate: boolean;
  skills: string[];
  categoryId: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  features: string[];
  requirements: string[];
  curriculum: Array<{
    week: number;
    topic: string;
  }>;
  Category: Category;
}

interface CoursesResponse {
  success: boolean;
  data: Course[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  statistics: {
    totalStudents: number;
    totalInstructors: number;
    averageTestimonialRating: number;
    totalTestimonials: number;
  };
  filters: {
    search?: string;
    category?: string;
    level?: string;
    language?: string;
    featured?: boolean;
    bestseller?: boolean;
    certificate?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy: string;
    sortOrder: string;
  };
  message: string;
}

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  Code,
  Smartphone,
  BarChart3,
  Palette,
  TrendingUp,
  Shield
};

export default function Courses() {
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
      
      @keyframes bounce-in {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          opacity: 1;
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
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
      
      .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
        opacity: 0;
      }
      
      .animate-bounce-in {
        animation: bounce-in 0.8s ease-out forwards;
        opacity: 0;
      }
      
      .animate-shimmer {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200px 100%;
        animation: shimmer 1.5s infinite;
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
  // API Data State
  const [coursesResponse, setCoursesResponse] = useState<CoursesResponse | null>(null);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter and Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Categories Function
  const fetchCategories = async () => {
    try {
      const baseUrl = isServer
        ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/"
        : "http://localhost:3000/api/";
      const tenantId = isServer
        ? process.env.NEXT_TENANT_ID || "tenant-1"
        : "tenant-1";
      
      const response = await fetch(`${baseUrl}categories`, {
        method: "GET",
        headers: {
          "x-tenant-id": tenantId,
          "Content-Type": "application/json",
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        cache: "no-store",
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategoriesList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // API Fetching Function
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = isServer
        ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api/"
        : "http://localhost:3000/api/";
      const tenantId = isServer
        ? process.env.NEXT_TENANT_ID || "tenant-1"
        : "tenant-1";
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        sortBy: sortBy === 'popular' ? 'students' : 
                sortBy === 'newest' ? 'createdAt' : 
                sortBy === 'rating' ? 'rating' : 
                sortBy === 'price-low' ? 'price' : 
                sortBy === 'price-high' ? 'price' : 'title',
        sortOrder: sortBy === 'price-low' ? 'asc' : 
                   sortBy === 'price-high' ? 'desc' : 
                   sortBy === 'newest' ? 'desc' : 
                   sortBy === 'rating' ? 'desc' : 
                   sortBy === 'popular' ? 'desc' : 'asc'
      });
      
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedLevel !== 'all') params.append('level', selectedLevel);
      
      const response = await fetch(`${baseUrl}courses?${params}`, {
        method: "GET",
        headers: {
          "x-tenant-id": tenantId,
          "Content-Type": "application/json",
        },
        referrerPolicy: 'strict-origin-when-cross-origin',
        cache: "no-store",
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data: CoursesResponse = await response.json();
      setCoursesResponse(data);
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Gagal memuat data kursus. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, selectedCategory, selectedLevel, sortBy]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchCourses();
  }, [currentPage, debouncedSearchQuery, selectedCategory, selectedLevel, sortBy]);

  // Get courses and stats from response
  const courses = coursesResponse?.data || [];
  const pagination = coursesResponse?.pagination;
  const apiStats = coursesResponse?.statistics;
  const stats = {
    totalCourses: pagination?.totalCount || 0,
    totalStudents: apiStats?.totalStudents || 1250, // Fallback for demo
    totalInstructors: apiStats?.totalInstructors || 25, // Fallback for demo
    averageRating: apiStats?.averageTestimonialRating || 4.8 // Fallback for demo
  };

  // Since we're using API filtering, we don't need client-side filtering
  const filteredAndSortedCourses = courses;

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

  // Loading Skeleton Components
  const CourseCardSkeleton = ({ isListView }: { isListView: boolean }) => {
    if (isListView) {
      return (
        <Card className="bg-white dark:bg-slate-800 border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Image Skeleton */}
              <div className="md:w-80 h-48 md:h-auto bg-gray-200 dark:bg-gray-700 animate-shimmer" />
              
              {/* Content Skeleton */}
              <div className="flex-1 p-6 space-y-4">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer" />
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                  <div className="h-4 w-18 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg overflow-hidden">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 animate-shimmer" />
        <CardContent className="p-6 space-y-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
            <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          <div className="flex justify-between items-center">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          </div>
        </CardContent>
      </Card>
    );
  };

  const CategorySkeleton = () => (
    <div className="flex flex-wrap gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const StatsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="text-center">
          <div 
            className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 animate-shimmer"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
          <div 
            className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-shimmer"
            style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
          />
        </div>
      ))}
    </div>
  );

  // CourseCard Component
  const CourseCard = ({ course, isListView }: { course: Course; isListView: boolean }) => {
    const category = course.Category;
    const IconComponent = categoryIcons[category?.icon as keyof typeof categoryIcons];

    if (isListView) {
      // List view
      return (
        <Card className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border-0 shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative md:w-80 h-48 md:h-auto">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="h-5 w-5 text-blue-600 ml-0.5" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {course.bestseller && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                      Bestseller
                    </Badge>
                  )}
                  {course.discount > 0 && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                      -{course.discount}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex flex-col h-full">
                  {/* Category */}
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {category?.name}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <CardContent>
                    <div className="space-y-4">
                      {course.faqs && course.faqs.length > 0 ? (
                        course.faqs.map((faq, index) => (
                          <div key={faq.id} className="border rounded-lg p-4">
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

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={course.instructor.avatar} 
                      alt={course.instructor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-sm">{course.instructor.name}</div>
                      <div className="text-xs text-gray-500">{course.instructor.bio}</div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{formatNumber(course.students)} siswa</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating} ({formatNumber(course.reviews)})</span>
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                      {course.certificate && (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Award className="h-3 w-3" />
                          <span>Sertifikat</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatPrice(course.price)}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(course.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Grid view (default)
    return (
      <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-slate-800 border-0 shadow-lg overflow-hidden">
        <div className="relative">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 text-blue-600 ml-1" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {course.bestseller && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                Bestseller
              </Badge>
            )}
            {course.discount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white">
                -{course.discount}%
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          {/* Category */}
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {category?.name}
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {course.instructor.name}
            </span>
          </div>

          {/* Course Info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{formatNumber(course.students)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          {/* Level */}
          <div className="mb-4">
            <Badge variant="secondary" className="text-xs">
              {course.level}
            </Badge>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(course.price)}
              </span>
              {course.originalPrice > course.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
            </div>
            
            {course.certificate && (
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <Award className="h-3 w-3" />
                <span>Sertifikat</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="full-bleed">
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Katalog Kursus Lengkap
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Temukan kursus terbaik untuk mengembangkan skill dan karir Anda
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                {loading ? (
                  <StatsSkeleton />
                ) : (
                  [
                    { label: "Total Kursus", value: stats.totalCourses, suffix: "+" },
                    { label: "Total Siswa", value: formatNumber(stats.totalStudents), suffix: "" },
                    { label: "Instruktur", value: stats.totalInstructors, suffix: "+" },
                    { label: "Rating Rata-rata", value: stats.averageRating.toFixed(1), suffix: "/5" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1 animate-bounce-in" style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
                        {stat.value}{stat.suffix}
                      </div>
                      <div className="text-sm text-blue-200">{stat.label}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Search and Filters */}
      <section className="py-8 bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cari kursus, instruktur, atau topik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              {searchQuery !== debouncedSearchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Filters - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categoriesList.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Level</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
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

            {/* View Mode and Mobile Filter Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </Button>

              <div className="flex border rounded-lg p-1 bg-gray-100 dark:bg-gray-700">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categoriesList.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Level</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

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
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          {categoriesList.length === 0 ? (
            <CategorySkeleton />
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className="rounded-full animate-fade-in"
              >
                Semua Kategori
              </Button>
              {categoriesList.map((category, index) => {
                const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons];
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="rounded-full animate-fade-in"
                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                    {category.name}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {loading ? (
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
              ) : pagination ? (
                <span className="animate-fade-in">
                  Menampilkan {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalCount)} dari {pagination.totalCount} kursus
                </span>
              ) : (
                <span className="animate-fade-in">Menampilkan {filteredAndSortedCourses.length} kursus</span>
              )}
            </div>
            
            {/* Active Filters */}
            {(debouncedSearchQuery || selectedCategory !== 'all' || selectedLevel !== 'all') && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Filter aktif:</span>
                {debouncedSearchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    "{debouncedSearchQuery}"
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {categoriesList.find(cat => cat.id === selectedCategory)?.name || selectedCategory}
                  </Badge>
                )}
                {selectedLevel !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedLevel}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedLevel("all");
                  }}
                  className="text-xs h-6 px-2"
                >
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* Courses Grid/List */}
          {loading ? (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {Array.from({ length: pageSize }).map((_, index) => (
                <CourseCardSkeleton key={index} isListView={viewMode === "list"} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg inline-block mb-4">
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Gagal Memuat Data</h3>
                <p>{error}</p>
              </div>
              <Button onClick={fetchCourses} className="mt-4">
                Coba Lagi
              </Button>
            </div>
          ) : filteredAndSortedCourses.length > 0 ? (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {filteredAndSortedCourses.map((course, index) => (
                <Link key={course.id} to={`/course/${course.slug}`}>
                  <div 
                    className="animate-fade-in" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CourseCard course={course} isListView={viewMode === "list"} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Tidak ada kursus ditemukan
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}>
                Reset Filter
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(
                    pagination.totalPages - 4,
                    Math.max(1, currentPage - 2)
                  )) + i;
                  
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-2"
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

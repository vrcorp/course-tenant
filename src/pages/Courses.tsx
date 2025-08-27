import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import coursesData from "@/data/courses.json";

// Icon mapping for categories
const categoryIcons = {
  Code,
  Smartphone,
  BarChart3,
  Palette,
  TrendingUp,
  Shield
};

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { categories, courses, stats } = coursesData;

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
      
      const matchesLevel = selectedLevel === "all" || course.level.toLowerCase().includes(selectedLevel.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLevel;
    });

    // Sort courses
    switch (sortBy) {
      case "popular":
        return filtered.sort((a, b) => b.students - a.students);
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "newest":
        return filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      default:
        return filtered;
    }
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

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

  const CourseCard = ({ course, isListView = false }: { course: any, isListView?: boolean }) => {
    const category = categories.find(cat => cat.id === course.category);
    const IconComponent = categoryIcons[category?.icon as keyof typeof categoryIcons];

    if (isListView) {
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
              {[
                { label: "Total Kursus", value: stats.totalCourses, suffix: "+" },
                { label: "Total Siswa", value: formatNumber(stats.totalStudents), suffix: "" },
                { label: "Instruktur", value: stats.totalInstructors, suffix: "+" },
                { label: "Jam Pembelajaran", value: stats.totalHours, suffix: "+" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
            </div>

            {/* Filters - Desktop */}
            <div className="hidden lg:flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map(category => (
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
                    {categories.map(category => (
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
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="rounded-full"
            >
              Semua Kategori
            </Button>
            {categories.map(category => {
              const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons];
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="rounded-full"
                >
                  {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="text-lg text-gray-600 dark:text-gray-400">
              Menampilkan {filteredAndSortedCourses.length} dari {courses.length} kursus
            </div>
          </div>

          {/* Courses Grid/List */}
          {filteredAndSortedCourses.length > 0 ? (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }>
              {filteredAndSortedCourses.map((course) => (
                <Link key={course.id} to={`/course/${course.slug}`}>
                  <CourseCard course={course} isListView={viewMode === "list"} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
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
        </div>
      </section>
    </div>
  );
}

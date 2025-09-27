import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Star, Users, ArrowRight, Play, Award } from "lucide-react";
import { Link } from "react-router-dom";
import coursesData from "@/data/courses.json";

export default function CoursesSection({ courses }: { courses: any }) {
  console.log("courses", courses);
  
  // Handle both array and object structures
  const coursesArray = Array.isArray(courses) ? courses : courses?.courses || [];
  
  // Get featured courses (limit to 6 for landing page)
  const featuredCourses = coursesArray.filter((course: any) => course.featured).slice(0, 6);
  const stats = courses?.stats || {};

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

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            Kursus Terpopuler
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kursus Berkualitas Tinggi
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Pelajari skill terbaru dari instruktur berpengalaman dengan kurikulum yang selalu update mengikuti perkembangan industri
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { label: "Total Kursus", value: stats.totalCourses || coursesArray.length, suffix: "+" },
              { label: "Total Siswa", value: formatNumber(stats.totalStudents || 5000), suffix: "" },
              { label: "Instruktur Expert", value: stats.totalInstructors || 25, suffix: "+" },
              { label: "Rating Rata-rata", value: stats.averageRating || 4.8, suffix: "/5" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Courses Grid */}
        {featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => (
            <Link key={course.id} to={`/course/${course.id}`} className="block">
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-slate-800 border-0 shadow-lg overflow-hidden cursor-pointer">
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
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {coursesData.categories.find(cat => cat.id === course.category)?.name}
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
            </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Belum ada kursus featured yang tersedia</p>
              <p className="text-sm">Kursus akan segera hadir!</p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link to="/courses">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold group">
              Lihat Semua Kursus
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Lebih dari {stats.totalCourses || coursesArray.length} kursus tersedia dengan berbagai kategori
          </p>
        </div>
      </div>
    </section>
  );
}

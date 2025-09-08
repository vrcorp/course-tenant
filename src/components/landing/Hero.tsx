import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight, Play } from "lucide-react";
import heroData from "@/data/hero-slides.json";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badge: string;
  stats: {
    [key: string]: string;
  };
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slides: HeroSlide[] = heroData.slides;
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Enhanced geometric background */}
      <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.05]">
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.3"/>
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="url(#gridGradient)" />
        </svg>
      </div>

      {/* Enhanced ambient lighting effects */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative z-10 w-full h-screen flex items-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container */}
        <div className="w-full overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={slide.id} className="w-full flex-shrink-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                    {/* Content Side */}
                    <div className="order-2 lg:order-1 text-center lg:text-left px-4">
                      {/* Status badge */}
                      <div className="flex justify-center lg:justify-start mb-4 sm:mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-blue-200/30 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/80 backdrop-blur-md text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300">
                          <span className="text-blue-600 dark:text-blue-400">
                            {slide.badge}
                          </span>
                        </div>
                      </div>

                      {/* Main heading */}
                      <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-3 sm:mb-4">
                          <span className="block text-gray-900 dark:text-white drop-shadow-sm">
                            {slide.title}
                          </span>
                        </h1>
                        
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed font-light mb-3 sm:mb-4">
                          {slide.subtitle}
                        </h2>
                        
                        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                          {slide.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Link 
                          to={slide.ctaLink} 
                          className="group relative h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-xl text-white flex items-center overflow-hidden w-full sm:w-auto justify-center"
                        >
                          <span className="relative z-10">{slide.ctaText}</span>
                          <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>

                        <Link 
                          to={slide.secondaryCtaLink} 
                          className="group relative h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl text-gray-900 dark:text-white flex items-center overflow-hidden w-full sm:w-auto justify-center"
                        >
                          <Play className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="relative z-10">{slide.secondaryCtaText}</span>
                        </Link>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
                        {Object.entries(slide.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                              {value}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image Side */}
                    <div className="order-1 lg:order-2 relative px-4">
                      <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls - Mobile Optimized */}
        <div className="absolute bottom-2 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 sm:gap-4 z-20">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 group touch-manipulation"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-1.5 sm:gap-2 px-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
                  index === currentSlide 
                    ? 'bg-blue-600 scale-125 shadow-lg' 
                    : 'bg-blue-600/40 hover:bg-blue-600/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-2 sm:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 group touch-manipulation"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Side Navigation Arrows - Desktop Only */}
        <button
          onClick={prevSlide}
          className="hidden"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
        </button>
        
        <button
          onClick={nextSlide}
          className="hidden"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
        </button>

        {/* Auto-play Toggle - Mobile Optimized */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-20">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
              isAutoPlaying 
                ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
            }`}
          >
            {isAutoPlaying ? 'Auto ✓' : 'Manual'}
          </button>
        </div>

        {/* Slide Counter - Mobile */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
          <div className="px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>
    </section>
  );
}
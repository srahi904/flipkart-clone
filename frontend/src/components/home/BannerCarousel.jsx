import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const banners = [
  {
    id: 1,
    title: 'Big Savings Days',
    subtitle: 'Up to 80% Off on Electronics, Fashion & More',
    cta: 'Shop Now',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2874f0 50%, #4a9af5 100%)',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 2,
    title: 'Fashion Mega Sale',
    subtitle: 'Min 40% to 80% Off — Top Brands',
    cta: 'Explore Now',
    gradient: 'linear-gradient(135deg, #e91e63 0%, #ff5252 50%, #ff8a80 100%)',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 3,
    title: 'Smartphones Sale',
    subtitle: 'Latest Mobiles at Best Prices — Exchange Offers Available',
    cta: 'Buy Now',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 4,
    title: 'Home & Kitchen',
    subtitle: 'Appliances & More Starting ₹499',
    cta: 'Shop Now',
    gradient: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #52b788 100%)',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=60',
  },
];

function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());
  const timerRef = useRef(null);

  const startAutoSlide = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(timerRef.current);
  }, [startAutoSlide]);

  // Preload all banner images immediately
  useEffect(() => {
    banners.forEach((banner, index) => {
      const img = new Image();
      img.onload = () => setImagesLoaded((prev) => new Set(prev).add(index));
      img.src = banner.image;
    });
  }, []);

  const goTo = (index) => {
    setCurrent(index);
    startAutoSlide();
  };

  const prev = () => goTo((current - 1 + banners.length) % banners.length);
  const next = () => goTo((current + 1) % banners.length);

  return (
    <div className="banner-carousel">
      <div
        className="banner-carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="banner-carousel-slide"
            style={{ background: banner.gradient }}
          >
            <div className="relative flex h-[220px] items-center justify-between overflow-hidden px-6 md:h-[280px] md:px-16">
              {/* Text Section */}
              <div className="relative z-10 max-w-md">
                <h2 className="text-2xl font-bold text-white md:text-4xl drop-shadow-sm">
                  {banner.title}
                </h2>
                <p className="mt-2 text-sm text-white/80 md:text-base">
                  {banner.subtitle}
                </p>
                <div className="mt-4 inline-flex items-center rounded bg-white px-5 py-2 text-sm font-bold text-[var(--fk-blue)] shadow-md">
                  {banner.cta} →
                </div>
              </div>

              {/* Image Section — shown on md+ screens */}
              <div className="absolute right-4 top-1/2 hidden h-[200px] w-[280px] -translate-y-1/2 md:block">
                <img
                  src={banner.image}
                  alt={banner.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className={`h-full w-full rounded-lg object-cover shadow-lg transition-opacity duration-500 ${
                    imagesLoaded.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              {/* Decorative circles */}
              <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/5" />
              <div className="absolute -bottom-16 -right-8 h-[200px] w-[200px] rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="banner-carousel-btn left"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-slate-700" />
      </button>
      <button
        type="button"
        className="banner-carousel-btn right"
        onClick={next}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-slate-700" />
      </button>

      <div className="banner-carousel-dots">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            className={`banner-carousel-dot ${index === current ? 'active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel;

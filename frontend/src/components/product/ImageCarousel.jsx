import { useState } from 'react';
import noImage from '@/assets/images/no-image.png';

function ImageCarousel({ images = [], alt }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayImages = images.length ? images : [{ url: noImage, altText: alt }];
  const activeImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="market-card rounded-[2px] p-3">
      <div className="grid gap-3 md:grid-cols-[72px_1fr]">
        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-y-auto md:max-h-[520px]">
          {displayImages.map((image, index) => (
            <button
              key={image.id || image.url || index}
              type="button"
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 overflow-hidden rounded-sm border-2 p-1 bg-white transition ${
                activeIndex === index
                  ? 'border-[var(--fk-blue)] shadow-sm'
                  : 'border-transparent hover:border-slate-300'
              }`}
            >
              <img
                src={image.url || noImage}
                alt={image.altText || alt}
                className="h-16 w-16 object-contain"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex items-center justify-center overflow-hidden border border-slate-200 bg-white p-6 rounded-sm">
          <img
            src={activeImage?.url || noImage}
            alt={activeImage?.altText || alt}
            className="max-h-[460px] w-full object-contain transition-opacity duration-300"
          />
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;

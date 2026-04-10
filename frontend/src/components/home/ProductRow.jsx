import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import formatCurrency from '@/utils/formatCurrency';
import calcDiscount from '@/utils/calcDiscount';
import noImage from '@/assets/images/no-image.png';

function ProductRow({ title, subtitle, products = [], viewAllLink, bgColor = 'white' }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const amount = 400;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div className="market-card rounded-[2px] overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="rounded-[2px] bg-[var(--fk-blue)] px-5 py-2 text-sm font-semibold text-white"
          >
            VIEW ALL
          </Link>
        )}
      </div>
      <div className="product-row-container">
        <button
          type="button"
          className="product-row-scroll-btn left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>
        <div className="product-row" ref={scrollRef}>
          {products.map((product) => {
            const primaryImage = product.images?.[0]?.url || noImage;
            const discount = calcDiscount(product.price, product.mrp);

            return (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="product-row-card block"
              >
                <img src={primaryImage} alt={product.name} loading="lazy" />
                <p className="card-name">{product.name}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="card-price">{formatCurrency(product.price)}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="card-mrp">{formatCurrency(product.mrp)}</span>
                  {discount ? <span className="card-discount">{discount}% off</span> : null}
                </div>
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          className="product-row-scroll-btn right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>
      </div>
    </div>
  );
}

export default ProductRow;

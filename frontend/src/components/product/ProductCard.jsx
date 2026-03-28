import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import noImage from '@/assets/images/no-image.png';
import formatCurrency from '@/utils/formatCurrency';
import calcDiscount from '@/utils/calcDiscount';

function ProductCard({ product, wishlisted = false, onToggleWishlist, onAddToCart }) {
  const primaryImage = product.images?.[0]?.url || noImage;
  const discount = calcDiscount(product.price, product.mrp);

  // Delivery estimate
  const days = 3 + Math.floor(Math.random() * 4);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

  return (
    <div className="market-card group relative rounded-[2px] transition hover:shadow-lg flex flex-col">
      {/* Wishlist button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist?.(product.id, wishlisted);
        }}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`h-4 w-4 transition ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
      </button>

      {/* Image */}
      <Link to={`/products/${product.id}`} className="block p-4">
        <img
          src={primaryImage}
          alt={product.name}
          className="mx-auto h-40 w-full object-contain transition group-hover:scale-105 duration-300"
          loading="lazy"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-1 px-4 pb-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm text-slate-700 leading-5 line-clamp-2 hover:text-[var(--fk-blue)] transition">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-1">
          <span className="fk-star-pill">
            {Number(product.rating).toFixed(1)}
            <Star />
          </span>
          <span className="text-xs text-slate-400">
            ({product.reviewCount?.toLocaleString('en-IN')})
          </span>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
          <span className="text-xs text-slate-400 line-through">{formatCurrency(product.mrp)}</span>
          {discount ? (
            <span className="text-xs font-semibold text-emerald-600">{discount}% off</span>
          ) : null}
        </div>

        {/* Delivery */}
        <p className="mt-1 text-xs text-slate-500">
          Free delivery by <span className="font-semibold text-slate-600">{deliveryStr}</span>
        </p>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={() => onAddToCart?.(product)}
          className="mt-auto pt-3 flex items-center justify-center gap-1.5 rounded-[2px] bg-[var(--fk-yellow)] px-3 py-2 text-xs font-bold text-white hover:bg-[#e68f00] transition"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default ProductCard;

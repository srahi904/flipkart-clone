import Spinner from '@/components/common/Spinner';
import ProductCard from './ProductCard';

function ProductGrid({ products = [], isLoading = false, wishlistedIds = [], onToggleWishlist, onAddToCart }) {
  if (isLoading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="market-card flex min-h-[30vh] flex-col items-center justify-center gap-2 rounded-[2px] p-6 text-center">
        <p className="text-lg font-semibold text-slate-600">No products found</p>
        <p className="text-sm text-slate-400">Try adjusting your search or filters to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div className="market-card rounded-[2px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-slate-100">
        {products.map((product) => (
          <div key={product.id} className="border-b border-r border-slate-100">
            <ProductCard
              product={product}
              wishlisted={wishlistedIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;

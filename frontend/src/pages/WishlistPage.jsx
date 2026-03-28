import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import ROUTES from '@/constants/routes';
import useCart from '@/hooks/useCart';
import useWishlist from '@/hooks/useWishlist';

function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, wishlistIds, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!wishlist.length) {
    return (
      <EmptyState
        title="Wishlist is empty"
        description="Save products you love and come back to them later."
        actionLabel="Browse products"
        onAction={() => navigate(ROUTES.products)}
        icon={Heart}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="market-card flex items-center justify-between rounded-[2px] px-5 py-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Saved Items</p>
          <h1 className="text-[30px] font-semibold text-slate-900">Wishlist</h1>
        </div>
        <p className="text-sm text-slate-600">{wishlist.length} product(s)</p>
      </div>
      <ProductGrid
        products={wishlist.map((entry) => entry.product)}
        wishlistedIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
        onAddToCart={(product) => addItem({ productId: product.id, quantity: 1 })}
      />
    </div>
  );
}

export default WishlistPage;

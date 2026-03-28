import { MapPin, ShoppingBag, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '@/components/common/EmptyState';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import ROUTES from '@/constants/routes';
import useCart from '@/hooks/useCart';

function CartPage() {
  const navigate = useNavigate();
  const { cart, isLoading, updateItem, removeItem } = useCart();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const items = cart?.items || [];

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add items to it now. Best deals are waiting for you!"
        actionLabel="Shop Now"
        icon={ShoppingBag}
        onAction={() => navigate(ROUTES.products)}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Delivery location */}
      <div className="market-card rounded-[2px] flex items-center gap-2 px-5 py-3">
        <MapPin className="h-4 w-4 text-slate-500" />
        <span className="text-sm text-slate-600">
          Deliver to: <span className="font-semibold text-slate-900">Bengaluru 560001</span>
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        {/* Cart Items */}
        <div>
          <div className="market-card rounded-[2px]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h1 className="text-lg font-semibold text-slate-900">
                My Cart ({items.length})
              </h1>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Truck className="h-4 w-4 text-emerald-500" />
                <span>Free delivery on all orders</span>
              </div>
            </div>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Place Order Button */}
          <div className="market-card rounded-[2px] mt-3 flex items-center justify-end px-5 py-4">
            <Button
              variant="accent"
              className="px-16 py-4 text-base"
              onClick={() => navigate(ROUTES.checkout)}
            >
              PLACE ORDER
            </Button>
          </div>
        </div>

        {/* Price Details */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <CartSummary summary={cart?.summary} itemCount={items.length} />
        </div>
      </div>
    </div>
  );
}

export default CartPage;

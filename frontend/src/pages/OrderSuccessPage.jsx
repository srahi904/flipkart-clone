import { CheckCircle, Package, Truck } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import ROUTES from '@/constants/routes';
import useOrders from '@/hooks/useOrders';
import formatCurrency from '@/utils/formatCurrency';

function OrderSuccessPage() {
  const { orderId } = useParams();
  const { order, isOrderLoading } = useOrders(orderId);

  if (isOrderLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  // Estimate delivery date (3-7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Success Banner */}
      <div className="market-card rounded-[2px] overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
              {order && (
                <p className="mt-1 text-sm text-emerald-100">
                  Order #{order.id} • {formatCurrency(order.total)}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-emerald-100 max-w-lg">
            Your order has been confirmed. You&apos;ll receive a confirmation email
            with tracking details shortly.
          </p>
        </div>

        {/* Delivery estimate */}
        <div className="flex items-center gap-4 bg-emerald-50 px-8 py-4">
          <Truck className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Estimated Delivery: {deliveryStr}
            </p>
            <p className="text-xs text-slate-500">Free delivery on this order</p>
          </div>
        </div>
      </div>

      {/* Order Items + Address */}
      {order && (
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          {/* Items list */}
          <div className="market-card rounded-[2px]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Order Items ({order.items?.length || 0})
              </h2>
              <span className="text-sm font-bold text-[var(--fk-blue)]">
                Total: {formatCurrency(order.total)}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={item.product?.images?.[0]?.url}
                    alt={item.product?.name}
                    className="h-20 w-20 border border-slate-200 rounded object-contain p-2"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-sm font-medium text-slate-900 hover:text-[var(--fk-blue)] truncate block"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.product?.brand} • Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <Package className="h-4 w-4" />
                    Confirmed
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Address + Price */}
          <div className="space-y-4">
            {/* Delivery address */}
            {order.address && (
              <div className="market-card rounded-[2px] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Delivery Address
                </h3>
                <p className="text-sm font-semibold text-slate-900">{order.address.name}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {order.address.line1}
                  {order.address.line2 ? `, ${order.address.line2}` : ''}
                </p>
                <p className="text-sm text-slate-600">
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
                <p className="text-sm text-slate-600 mt-1">Phone: {order.address.phone}</p>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="market-card rounded-[2px] p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Price Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium text-emerald-600">
                    {Number(order.shippingCost) > 0 ? formatCurrency(order.shippingCost) : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 mt-2">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-base font-bold text-slate-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-center gap-3 py-4">
        <Link to={ROUTES.home}>
          <Button className="px-8">Continue Shopping</Button>
        </Link>
        <Link to={ROUTES.orders}>
          <Button variant="secondary" className="px-8">View All Orders</Button>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccessPage;

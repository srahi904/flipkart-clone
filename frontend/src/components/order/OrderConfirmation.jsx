import { Calendar, MapPin, Package } from 'lucide-react';
import formatCurrency from '@/utils/formatCurrency';
import formatDate from '@/utils/formatDate';
import noImage from '@/assets/images/no-image.png';

function OrderConfirmation({ order }) {
  // Estimated delivery (3-7 days from order)
  const deliveryDate = new Date(order.placedAt);
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Order Info Card */}
      <div className="market-card rounded-[2px] p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-[var(--fk-blue)] mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Order ID</p>
              <p className="text-base font-bold text-slate-900 mt-1">#{order.id}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-[var(--fk-blue)] mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Order Date</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{formatDate(order.placedAt)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[var(--fk-blue)] mt-0.5" />
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Estimated Delivery</p>
              <p className="text-sm font-semibold text-emerald-600 mt-1">{deliveryStr}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="market-card rounded-[2px] p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase">
            {order.status}
          </span>
          <span className="text-sm text-slate-500">•</span>
          <span className="text-sm text-slate-600">Payment: Cash on Delivery</span>
        </div>
      </div>

      {/* Order Items */}
      <div className="market-card rounded-[2px]">
        <div className="border-b border-slate-200 px-5 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            ORDER ITEMS ({order.items?.length || 0})
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-5">
              <img
                src={item.product.images?.[0]?.url || noImage}
                alt={item.product.name}
                className="h-20 w-20 border border-slate-200 object-contain p-2 rounded-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900">{item.product.name}</p>
                <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                <p className="mt-1 text-sm text-slate-500">{item.product.brand}</p>
              </div>
              <p className="text-base font-bold text-slate-900 shrink-0">
                {formatCurrency(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900">Order Total</span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      {order.shippingAddress && (
        <div className="market-card rounded-[2px] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
            DELIVERY ADDRESS
          </h3>
          <p className="font-semibold text-slate-900">{order.shippingAddress.name}</p>
          <p className="text-sm text-slate-600 mt-1">{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && (
            <p className="text-sm text-slate-600">{order.shippingAddress.line2}</p>
          )}
          <p className="text-sm text-slate-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
          <p className="text-sm text-slate-600 mt-1">Phone: {order.shippingAddress.phone}</p>
        </div>
      )}
    </div>
  );
}

export default OrderConfirmation;

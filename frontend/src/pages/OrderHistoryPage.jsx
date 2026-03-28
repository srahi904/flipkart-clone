import { ChevronRight, Package, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '@/components/common/Spinner';
import EmptyState from '@/components/common/EmptyState';
import ROUTES from '@/constants/routes';
import useOrders from '@/hooks/useOrders';
import formatCurrency from '@/utils/formatCurrency';

const statusColors = {
  PENDING: 'bg-amber-50 text-amber-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

const statusDots = {
  PENDING: 'bg-amber-500',
  CONFIRMED: 'bg-blue-500',
  SHIPPED: 'bg-indigo-500',
  DELIVERED: 'bg-emerald-500',
  CANCELLED: 'bg-red-500',
};

function OrderHistoryPage() {
  const navigate = useNavigate();
  const { orders, isOrdersLoading } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');

  if (isOrdersLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Looks like you haven't placed any orders. Start shopping and your orders will appear here."
        actionLabel="Start Shopping"
        onAction={() => navigate(ROUTES.products)}
      />
    );
  }

  // Filter orders by search
  const filteredOrders = searchQuery
    ? orders.filter((order) =>
        order.items?.some((item) =>
          item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        ) || String(order.id).includes(searchQuery)
      )
    : orders;

  return (
    <div className="space-y-0 animate-fade-in-up">
      {/* Header */}
      <div className="market-card rounded-[2px] mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">My Orders</h1>
            <p className="text-sm text-slate-500 mt-0.5">{orders.length} order(s) placed</p>
          </div>
          {/* Search orders */}
          <div className="relative max-w-sm w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your orders here"
              className="w-full rounded-sm border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--fk-blue)]"
            />
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="market-card rounded-[2px] overflow-hidden">
            {/* Order header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div>
                  <span className="font-semibold text-slate-400 uppercase">Order #</span>
                  <span className="ml-1 font-bold text-slate-700">{order.id}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase">Placed</span>
                  <span className="ml-1 text-slate-700">
                    {new Date(order.placedAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 uppercase">Total</span>
                  <span className="ml-1 font-bold text-slate-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${statusDots[order.status] || 'bg-slate-400'}`} />
                {order.status}
              </div>
            </div>

            {/* Order items */}
            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <Link
                  key={item.id}
                  to={`/order-success/${order.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                >
                  <img
                    src={item.product?.images?.[0]?.url}
                    alt={item.product?.name}
                    className="h-16 w-16 border border-slate-200 rounded object-contain p-1.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.product?.brand} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                      <Package className="h-3 w-3" />
                      <span>{order.status === 'DELIVERED' ? 'Delivered' : 'In Progress'}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && searchQuery && (
          <div className="market-card rounded-[2px] p-10 text-center">
            <p className="text-slate-500">No orders found matching &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;

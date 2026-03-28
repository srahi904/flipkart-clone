import { Shield, Tag, Truck } from 'lucide-react';
import formatCurrency from '@/utils/formatCurrency';

function CartSummary({ summary, itemCount = 0 }) {
  if (!summary) return null;

  return (
    <div className="market-card rounded-[2px] bg-white">
      <div className="border-b border-slate-200 px-5 py-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">PRICE DETAILS</h3>
      </div>
      <div className="space-y-3 p-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-700">Price ({itemCount} item{itemCount > 1 ? 's' : ''})</span>
          <span className="text-slate-900">{formatCurrency(summary.originalTotal || summary.subtotal)}</span>
        </div>
        {summary.savings > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-700">Discount</span>
            <span className="font-semibold text-emerald-600">− {formatCurrency(summary.savings)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-slate-700">Delivery Charges</span>
          <span className="font-semibold text-emerald-600">
            {summary.shipping ? formatCurrency(summary.shipping) : 'FREE'}
          </span>
        </div>
        <div className="border-t border-dashed border-slate-200 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900">Total Amount</span>
            <span className="text-base font-bold text-slate-900">{formatCurrency(summary.total)}</span>
          </div>
        </div>
        {summary.savings > 0 && (
          <p className="text-sm font-semibold text-emerald-600">
            You will save {formatCurrency(summary.savings)} on this order
          </p>
        )}
      </div>
      <div className="border-t border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Shield className="h-4 w-4 text-slate-400" />
          Safe and Secure Payments. Easy returns. 100% Authentic products.
        </div>
      </div>
    </div>
  );
}

export default CartSummary;

import formatCurrency from '@/utils/formatCurrency';
import noImage from '@/assets/images/no-image.png';

function OrderSummary({ items = [], summary }) {
  return (
    <div className="market-card rounded-[2px] bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-semibold uppercase tracking-[0.08em] text-slate-700">Price Details</h3>
      </div>
      <div className="space-y-4 p-5">
        {items.map((item) => (
          <div key={item.id || `${item.productId}-${item.quantity}`} className="flex items-start gap-3">
            <img
              src={item.product.images?.[0]?.url || noImage}
              alt={item.product.name}
              className="h-16 w-16 border border-slate-200 object-contain p-2"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{item.product.name}</p>
              <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-slate-900">
              {formatCurrency(Number(item.price || item.product.price) * item.quantity)}
            </p>
          </div>
        ))}
        {summary ? (
          <>
            <div className="my-6 h-px bg-slate-200" />
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="font-semibold text-slate-900">
                  {summary.shipping ? formatCurrency(summary.shipping) : 'FREE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total</span>
                <span className="font-semibold text-slate-900">{formatCurrency(summary.total)}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default OrderSummary;

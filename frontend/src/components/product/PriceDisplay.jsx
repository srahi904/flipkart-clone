import calcDiscount from '@/utils/calcDiscount';
import formatCurrency from '@/utils/formatCurrency';

function PriceDisplay({ price, mrp, size = 'base' }) {
  const discount = calcDiscount(price, mrp);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`font-display font-bold text-slate-900 ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>
        {formatCurrency(price)}
      </span>
      <span className="text-sm text-slate-400 line-through">{formatCurrency(mrp)}</span>
      {discount ? <span className="text-sm font-semibold text-emerald-600">{discount}% off</span> : null}
    </div>
  );
}

export default PriceDisplay;

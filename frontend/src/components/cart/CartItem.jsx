import { Minus, Plus, Trash2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import noImage from '@/assets/images/no-image.png';
import formatCurrency from '@/utils/formatCurrency';

function CartItem({ item, onUpdate, onRemove }) {
  const product = item.product;
  const image = product.images?.[0]?.url || noImage;
  const total = Number(item.price || product.price) * item.quantity;

  // Delivery date estimate
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(Math.random() * 3));
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="border-b border-slate-100 p-5 last:border-none">
      <div className="flex gap-4">
        {/* Image */}
        <Link to={`/product/${product.slug}`} className="shrink-0">
          <img
            src={image}
            alt={product.name}
            className="h-24 w-24 border border-slate-200 object-contain p-2 rounded-sm"
          />
        </Link>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-medium text-slate-900 text-sm leading-5 hover:text-[var(--fk-blue)] transition">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-500">{product.brand}</p>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">{formatCurrency(item.price || product.price)}</span>
            {product.mrp && Number(product.mrp) > Number(item.price || product.price) && (
              <>
                <span className="text-sm text-slate-400 line-through">{formatCurrency(product.mrp)}</span>
                <span className="text-sm font-semibold text-emerald-600">
                  {Math.round((1 - Number(item.price || product.price) / Number(product.mrp)) * 100)}% off
                </span>
              </>
            )}
          </div>

          {/* Delivery info */}
          <p className="mt-2 text-xs text-slate-500">
            Delivery by <span className="font-semibold text-slate-700">{deliveryStr}</span>{' '}
            | <span className="text-emerald-600 font-semibold">Free</span> <span className="text-slate-400 line-through">₹40</span>
          </p>
        </div>

        {/* Line total on desktop */}
        <div className="hidden sm:block shrink-0 text-right">
          <p className="text-lg font-bold text-slate-900">{formatCurrency(total)}</p>
        </div>
      </div>

      {/* Action row */}
      <div className="mt-4 flex items-center gap-6 pl-28">
        {/* Quantity controls */}
        <div className="inline-flex items-center rounded-full border border-slate-300">
          <button
            type="button"
            onClick={() =>
              item.quantity > 1
                ? onUpdate({ itemId: item.id, payload: { quantity: item.quantity - 1 } })
                : onRemove(item.id)
            }
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdate({ itemId: item.id, payload: { quantity: item.quantity + 1 } })}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-sm font-semibold text-slate-600 hover:text-[var(--fk-blue)] uppercase"
        >
          REMOVE
        </button>
      </div>
    </div>
  );
}

export default CartItem;

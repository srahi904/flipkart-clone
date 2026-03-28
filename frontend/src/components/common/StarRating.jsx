import { Star } from 'lucide-react';

function StarRating({ rating = 0, reviews, compact = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
        <span>{Number(rating).toFixed(1)}</span>
        <Star className="h-3 w-3 fill-current" />
      </div>
      {reviews ? (
        <span className={`text-slate-500 ${compact ? 'text-xs' : 'text-sm'}`}>
          {reviews.toLocaleString('en-IN')} ratings
        </span>
      ) : null}
    </div>
  );
}

export default StarRating;

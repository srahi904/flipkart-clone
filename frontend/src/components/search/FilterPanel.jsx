import Button from '@/components/common/Button';
import StarRating from '@/components/common/StarRating';

const priceRanges = [
  { label: 'Under ₹1,000', min: 0, max: 1000 },
  { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { label: '₹5,000 - ₹20,000', min: 5000, max: 20000 },
  { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: '' },
];

function FilterPanel({ categories = [], filters, onChange, onReset }) {
  const activePriceRange = priceRanges.find(
    (range) =>
      String(range.min) === String(filters.minPrice) &&
      String(range.max) === String(filters.maxPrice)
  );

  return (
    <div className="space-y-0 divide-y divide-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold uppercase text-[var(--fk-blue)]"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Categories */}
      <div className="px-4 py-3">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          CATEGORIES
        </h4>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="categoryFilter"
              checked={!filters.categoryId}
              onChange={() => onChange('categoryId', '')}
              className="accent-[var(--fk-blue)]"
            />
            <span className={!filters.categoryId ? 'font-semibold text-[var(--fk-blue)]' : 'text-slate-700'}>
              All Categories
            </span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="categoryFilter"
                checked={String(filters.categoryId) === String(category.id)}
                onChange={() => onChange('categoryId', category.id)}
                className="accent-[var(--fk-blue)]"
              />
              <span
                className={
                  String(filters.categoryId) === String(category.id)
                    ? 'font-semibold text-[var(--fk-blue)]'
                    : 'text-slate-700'
                }
              >
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="px-4 py-3">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          PRICE RANGE
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const isActive =
              String(range.min) === String(filters.minPrice) &&
              String(range.max) === String(filters.maxPrice);
            return (
              <label key={range.label} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="priceRange"
                  checked={isActive}
                  onChange={() => {
                    onChange('minPrice', range.min);
                    onChange('maxPrice', range.max);
                  }}
                  className="accent-[var(--fk-blue)]"
                />
                <span className={isActive ? 'font-semibold text-[var(--fk-blue)]' : 'text-slate-700'}>
                  {range.label}
                </span>
              </label>
            );
          })}
          {activePriceRange && (
            <button
              type="button"
              onClick={() => {
                onChange('minPrice', '');
                onChange('maxPrice', '');
              }}
              className="text-xs font-semibold text-[var(--fk-blue)]"
            >
              Clear price filter
            </button>
          )}
        </div>

        {/* Custom min/max */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500">Min</label>
            <select
              value={filters.minPrice || ''}
              onChange={(e) => onChange('minPrice', e.target.value)}
              className="mt-1 w-full rounded-[2px] border border-slate-300 px-2 py-1.5 text-xs outline-none"
            >
              <option value="">Min</option>
              {[500, 1000, 5000, 10000, 20000, 50000].map((v) => (
                <option key={v} value={v}>₹{v.toLocaleString('en-IN')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500">to</label>
            <select
              value={filters.maxPrice || ''}
              onChange={(e) => onChange('maxPrice', e.target.value)}
              className="mt-1 w-full rounded-[2px] border border-slate-300 px-2 py-1.5 text-xs outline-none"
            >
              <option value="">Max</option>
              {[1000, 5000, 10000, 25000, 50000, 100000, 200000].map((v) => (
                <option key={v} value={v}>₹{v.toLocaleString('en-IN')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customer Ratings */}
      <div className="px-4 py-3">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          CUSTOMER RATINGS
        </h4>
        <div className="space-y-2">
          {[4, 3].map((rating) => (
            <label key={rating} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.minRating === String(rating)}
                onChange={() =>
                  onChange('minRating', filters.minRating === String(rating) ? '' : String(rating))
                }
                className="accent-[var(--fk-blue)]"
              />
              <span className="flex items-center gap-1 text-slate-700">
                {rating}★ & above
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="px-4 py-3">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          SORT BY
        </h4>
        <div className="space-y-2">
          {[
            { value: 'featured', label: 'Popularity' },
            { value: 'priceAsc', label: 'Price — Low to High' },
            { value: 'priceDesc', label: 'Price — High to Low' },
            { value: 'ratingDesc', label: 'Top Rated' },
            { value: 'newest', label: 'Newest First' },
          ].map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="sortFilter"
                checked={filters.sort === option.value}
                onChange={() => onChange('sort', option.value)}
                className="accent-[var(--fk-blue)]"
              />
              <span
                className={
                  filters.sort === option.value ? 'font-semibold text-[var(--fk-blue)]' : 'text-slate-700'
                }
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;

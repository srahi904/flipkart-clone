import { Search } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';

function SearchBar({
  defaultValue = '',
  placeholder = 'Search for products, brands and more',
  onSubmit,
  onValueChange,
  compact = false,
  suggestions = [],
  suggestionsLoading = false,
  showSuggestions = false,
  onSuggestionSelect,
  onFocus,
  onBlur,
}) {
  const [value, setValue] = useState(defaultValue);
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(deferredValue);
    }
  }, [deferredValue, onValueChange]);

  return (
    <div className="relative">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(value.trim());
        }}
        className={`flex items-center overflow-hidden rounded-[2px] border border-transparent bg-[var(--search-bg)] px-4 shadow-sm ${
          compact ? 'h-11' : 'h-10 md:h-10'
        }`}
      >
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className="h-full w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
          placeholder={placeholder}
        />
        <input type="submit" value="" className="hidden" />
        <Search className="h-5 w-5 shrink-0 text-[var(--brand-blue)]" />
      </form>

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[2px] border border-slate-200 bg-white shadow-xl">
          {suggestionsLoading ? (
            <div className="px-4 py-3 text-sm text-slate-500">Searching products...</div>
          ) : suggestions.length ? (
            <div className="py-2">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSuggestionSelect?.(item)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {item.brand} - {item.category?.name || 'Product'}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-semibold text-[var(--brand-blue)]">View</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500">No matching products found.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;

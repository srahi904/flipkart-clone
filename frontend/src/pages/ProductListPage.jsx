import { startTransition, useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';
import Sidebar from '@/components/layout/Sidebar';
import ProductGrid from '@/components/product/ProductGrid';
import FilterPanel from '@/components/search/FilterPanel';
import ROUTES from '@/constants/routes';
import useCart from '@/hooks/useCart';
import useDebounce from '@/hooks/useDebounce';
import { useCategories, useProducts } from '@/hooks/useProducts';
import useWishlist from '@/hooks/useWishlist';
import { addToast, setMobileFiltersOpen } from '@/store/slices/uiSlice';

const sortTabs = [
  { value: 'featured', label: 'Popularity' },
  { value: 'priceAsc', label: 'Price — Low to High' },
  { value: 'priceDesc', label: 'Price — High to Low' },
  { value: 'ratingDesc', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

function ProductListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const mobileFiltersOpen = useSelector((state) => state.ui.mobileFiltersOpen);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchValue);

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') || '',
      categoryId: searchParams.get('categoryId') || '',
      category: searchParams.get('category') || '', // name-based category
      sort: searchParams.get('sort') || 'featured',
      page: Number(searchParams.get('page') || 1),
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minRating: searchParams.get('minRating') || '',
    }),
    [searchParams],
  );

  const { data: categories = [] } = useCategories();

  // Auto-resolve category name to categoryId when categories load
  useEffect(() => {
    if (filters.category && !filters.categoryId && categories.length > 0) {
      const match = categories.find(
        (c) => c.name.toLowerCase() === filters.category.toLowerCase()
      );
      if (match) {
        startTransition(() => {
          const next = new URLSearchParams(searchParams);
          next.set('categoryId', String(match.id));
          next.delete('category'); // remove the name param once resolved
          setSearchParams(next, { replace: true });
        });
      }
    }
  }, [filters.category, filters.categoryId, categories, searchParams, setSearchParams]);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const nextSearch = debouncedSearch.trim();
    if (nextSearch === filters.search) return;

    startTransition(() => {
      const next = new URLSearchParams(searchParams);
      if (nextSearch) {
        next.set('search', nextSearch);
      } else {
        next.delete('search');
      }
      next.set('page', '1');
      setSearchParams(next);
    });
  }, [debouncedSearch, filters.search, searchParams, setSearchParams]);

  // Build API params — pass category name as fallback if categoryId isn't resolved
  const apiParams = {
    page: filters.page,
    sort: filters.sort,
    ...(filters.search ? { search: filters.search } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(!filters.categoryId && filters.category ? { category: filters.category } : {}),
    ...(filters.minPrice ? { minPrice: filters.minPrice } : {}),
    ...(filters.maxPrice ? { maxPrice: filters.maxPrice } : {}),
  };

  const { data, isLoading } = useProducts(apiParams);
  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();

  const handleFilterChange = (key, value) => {
    startTransition(() => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
      if (key !== 'page') {
        next.set('page', '1');
      }
      // When setting categoryId, remove category name param
      if (key === 'categoryId') {
        next.delete('category');
      }
      setSearchParams(next);
    });
  };

  const requireAuth = () => {
    dispatch(addToast({ variant: 'info', message: 'Please login to continue' }));
    navigate(ROUTES.login);
  };

  // Determine current category name for the title
  const currentCategory = categories.find((c) => String(c.id) === String(filters.categoryId));
  const categoryDisplayName = currentCategory?.name || filters.category || '';
  const pageTitle = categoryDisplayName
    ? categoryDisplayName
    : filters.search
      ? `Results for "${filters.search}"`
      : 'All Products';

  const totalProducts = data?.pagination?.total || 0;
  const showingFrom = data?.products?.length ? (filters.page - 1) * 20 + 1 : 0;
  const showingTo = showingFrom + (data?.products?.length || 0) - 1;

  return (
    <div className="space-y-0">
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-[110px]">
            <Sidebar>
              <FilterPanel
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onReset={() => setSearchParams(new URLSearchParams())}
              />
            </Sidebar>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-0">
          {/* Header with sort tabs */}
          <div className="market-card rounded-[2px] mb-3">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
                <p className="text-xs text-slate-500 mt-1">
                  {totalProducts > 0
                    ? `(Showing ${showingFrom} – ${showingTo} of ${totalProducts.toLocaleString('en-IN')} products)`
                    : isLoading
                      ? 'Loading products...'
                      : 'No products found'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dispatch(setMobileFiltersOpen(true))}
                className="inline-flex h-9 items-center gap-2 rounded-[2px] border border-slate-300 px-3 text-sm font-semibold text-slate-700 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
            {/* Sort Tabs */}
            <div className="flex overflow-x-auto px-2">
              {sortTabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => handleFilterChange('sort', tab.value)}
                  className={`shrink-0 px-4 py-3 text-sm font-medium transition ${
                    filters.sort === tab.value
                      ? 'border-b-2 border-[var(--fk-blue)] text-[var(--fk-blue)]'
                      : 'text-slate-600 hover:text-[var(--fk-blue)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <ProductGrid
            products={data?.products || []}
            isLoading={isLoading}
            wishlistedIds={wishlistIds}
            onToggleWishlist={(productId, wishlisted) =>
              token ? toggleWishlist(productId, wishlisted) : requireAuth()
            }
            onAddToCart={(product) =>
              token ? addItem({ productId: product.id, quantity: 1 }) : requireAuth()
            }
          />
          <div className="mt-4">
            <Pagination
              currentPage={data?.pagination?.page || 1}
              totalPages={data?.pagination?.totalPages || 1}
              onPageChange={(page) => handleFilterChange('page', page)}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={mobileFiltersOpen}
        onClose={() => dispatch(setMobileFiltersOpen(false))}
        title="Filter products"
      >
        <FilterPanel
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onReset={() => setSearchParams(new URLSearchParams())}
        />
      </Modal>
    </div>
  );
}

export default ProductListPage;

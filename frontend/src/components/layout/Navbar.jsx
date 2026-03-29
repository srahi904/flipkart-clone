import { ChevronDown, Heart, LogOut, Package, ShoppingCart, User } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '@/components/search/SearchBar';
import ROUTES from '@/constants/routes';
import { useCategories } from '@/hooks/useProducts';
import useDebounce from '@/hooks/useDebounce';
import productService from '@/services/productService';
import { clearSession } from '@/store/slices/authSlice';
import { clearCartState } from '@/store/slices/cartSlice';
import { clearWishlistState } from '@/store/slices/wishlistSlice';
import logo from '@/assets/images/flipkart-logo.svg';

const categoryNavConfig = [
  {
    label: 'Electronics',
    categoryNames: ['Electronics'],
    subcategories: [
      { label: 'Laptops', search: 'Laptop' },
      { label: 'Headphones', search: 'Headphones' },
      { label: 'Speakers', search: 'Speaker' },
      { label: 'Tablets', search: 'Tablet' },
      { label: 'Earbuds', search: 'Earbuds' },
    ],
  },
  {
    label: 'TVs & Appliances',
    categoryNames: ['TVs & Appliances'],
    subcategories: [
      { label: 'Smart TVs', search: 'TV' },
      { label: 'Washing Machines', search: 'Washing Machine' },
      { label: 'Refrigerators', search: 'Refrigerator' },
      { label: 'Air Conditioners', search: 'AC' },
    ],
  },
  {
    label: 'Men',
    categoryNames: ["Men's Fashion"],
    subcategories: [
      { label: 'Shirts', search: 'Shirt' },
      { label: 'Jeans', search: 'Jeans' },
      { label: 'T-Shirts', search: 'T-Shirt' },
      { label: 'Kurtas', search: 'Kurta' },
      { label: 'Jackets', search: 'Jacket' },
      { label: 'Sneakers', search: 'Sneakers' },
      { label: 'Watches', search: 'Watch' },
    ],
  },
  {
    label: 'Women',
    categoryNames: ["Women's Fashion"],
    subcategories: [
      { label: 'Sarees', search: 'Saree' },
      { label: 'Kurtis', search: 'Kurti' },
      { label: 'Dresses', search: 'Dress' },
      { label: 'Handbags', search: 'Handbag' },
      { label: 'Heels', search: 'Heel' },
      { label: 'Jewelry', search: 'Earrings' },
    ],
  },
  {
    label: 'Baby & Kids',
    categoryNames: ['Baby & Kids'],
    subcategories: [
      { label: 'Kids Clothing', search: 'Romper' },
      { label: 'Toys', search: 'LEGO' },
      { label: 'Baby Care', search: 'Diapers' },
    ],
  },
  {
    label: 'Home & Furniture',
    categoryNames: ['Home & Kitchen'],
    subcategories: [
      { label: 'Cookware', search: 'Cookware' },
      { label: 'Kitchen Appliances', search: 'Microwave' },
      { label: 'Storage', search: 'Bottle' },
      { label: 'Air Purifiers', search: 'Air Purifier' },
    ],
  },
  {
    label: 'Sports, Books & More',
    categoryNames: ['Sports & Fitness', 'Books'],
    subcategories: [
      { label: 'Running Shoes', search: 'Running Shoes' },
      { label: 'Gym Equipment', search: 'Treadmill' },
      { label: 'Cricket', search: 'Cricket Bat' },
      { label: 'Bestseller Books', search: 'Atomic Habits' },
      { label: 'Self-Help', search: 'Psychology' },
    ],
  },
  {
    label: 'Grocery',
    categoryNames: ['Grocery'],
    subcategories: [
      { label: 'Pulses & Dals', search: 'Dal' },
      { label: 'Edible Oils', search: 'Oil' },
      { label: 'Chocolates', search: 'Chocolate' },
    ],
  },
  { label: 'Offer Zone', featured: true },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const menuRef = useRef(null);
  const { data: categories = [] } = useCategories();
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector((state) => state.cart.summary.totalItems);
  const wishlistCount = useSelector((state) => state.wishlist.ids.length);
  const [searchInput, setSearchInput] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 250);

  const { data: suggestionData, isLoading: suggestionsLoading } = useQuery({
    queryKey: ['search-suggestions', debouncedSearch],
    queryFn: () => productService.getProducts({ search: debouncedSearch, limit: 6 }),
    enabled: debouncedSearch.trim().length >= 2,
  });

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = () => {
    dispatch(clearSession());
    dispatch(clearCartState());
    dispatch(clearWishlistState());
    queryClient.clear();
    navigate(ROUTES.home);
  };

  // Resolve category ID at CLICK time (not render time) to avoid stale links
  const findCategoryId = useCallback(
    (categoryNames) => {
      for (const name of categoryNames) {
        const match = categories.find(
          (c) => c.name.toLowerCase() === name.toLowerCase()
        );
        if (match) return match.id;
      }
      return null;
    },
    [categories]
  );

  const handleCategoryClick = useCallback(
    (e, config) => {
      e.preventDefault();
      if (config.featured) {
        navigate(`${ROUTES.products}?featured=true`);
        return;
      }
      const catId = findCategoryId(config.categoryNames || []);
      if (catId) {
        navigate(`${ROUTES.products}?categoryId=${catId}`);
      } else {
        // Fallback: navigate with category name for display, no search filter
        navigate(`${ROUTES.products}?category=${encodeURIComponent(config.categoryNames?.[0] || config.label)}`);
      }
    },
    [navigate, findCategoryId]
  );

  const handleSubcategoryClick = useCallback(
    (e, config, sub) => {
      e.preventDefault();
      const catId = findCategoryId(config.categoryNames || []);
      if (catId) {
        navigate(`${ROUTES.products}?categoryId=${catId}&search=${encodeURIComponent(sub.search)}`);
      } else {
        navigate(`${ROUTES.products}?search=${encodeURIComponent(sub.search)}`);
      }
    },
    [navigate, findCategoryId]
  );

  const searchParams = new URLSearchParams(location.search);
  const searchDefault = location.pathname === ROUTES.products ? searchParams.get('search') || '' : '';
  const suggestions = suggestionData?.products || [];
  const showSuggestions = searchFocused && searchInput.trim().length >= 2;

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="bg-[var(--fk-blue)] text-white">
        <div className="page-shell flex flex-wrap items-center gap-3 px-3 py-2 md:flex-nowrap md:gap-6">
          <Link to={ROUTES.home} className="flex min-w-fit items-center">
            <img src={logo} alt="Flipkart Clone" className="h-7 w-auto md:h-8" />
          </Link>

          <div className="order-3 w-full md:order-none md:flex-1">
            <SearchBar
              defaultValue={searchDefault}
              suggestions={suggestions}
              suggestionsLoading={suggestionsLoading}
              showSuggestions={showSuggestions}
              onValueChange={setSearchInput}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {
                window.setTimeout(() => setSearchFocused(false), 150);
              }}
              onSuggestionSelect={(item) => {
                setSearchFocused(false);
                navigate(`/products/${item.id}`);
              }}
              onSubmit={(value) => {
                setSearchFocused(false);
                const query = value ? `?search=${encodeURIComponent(value)}` : '';
                navigate(`${ROUTES.products}${query}`);
              }}
            />
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm md:gap-5">
            {/* Account section with hover dropdown — Flipkart style */}
            <div className="category-nav-item relative">
              {user ? (
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-[2px] bg-white px-4 py-2 font-semibold text-[var(--fk-blue)] md:px-5"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden max-w-28 truncate md:inline">{user.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              ) : (
                <Link
                  to={ROUTES.login}
                  className="flex items-center gap-1.5 rounded-[2px] px-5 py-2 font-semibold text-[var(--fk-blue)]"
                >
                  Login
                  <ChevronDown className="h-3 w-3" />
                </Link>
              )}

              {/* Hover dropdown */}
              <div 
                className="category-dropdown" 
                style={{ 
                  minWidth: '220px', 
                  right: 0, 
                  left: 'auto', 
                  transform: 'none',
                  animation: 'dropdownFadeInRightAnchored 0.15s ease-out' 
                }}
              >
                {!user && (
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-500">New customer?</span>
                    <Link to={ROUTES.register} className="text-sm font-bold text-[var(--fk-blue)]">
                      Sign Up
                    </Link>
                  </div>
                )}
                {user && (
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-400">Logged in as</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">{user.email}</p>
                  </div>
                )}
                
                <Link to={user ? ROUTES.orders : ROUTES.login} className="!flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50">
                  <Package className="h-4 w-4 text-[var(--fk-blue)]" />
                  My Orders
                </Link>
                <Link to={user ? ROUTES.wishlist : ROUTES.login} className="!flex items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50">
                  <Heart className="h-4 w-4 text-[var(--fk-blue)]" />
                  Wishlist
                </Link>
                
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="!flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4 text-[var(--fk-blue)]" />
                    Logout
                  </button>
                ) : (
                  <Link to={ROUTES.login} className="!flex items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm font-semibold text-[var(--fk-blue)] transition hover:bg-slate-50">
                    <LogOut className="h-4 w-4" />
                    Login
                  </Link>
                )}
              </div>
            </div>

            <Link to={ROUTES.products} className="hidden whitespace-nowrap md:inline-flex">
              Become a Seller
            </Link>

            

            <Link to={ROUTES.cart} className="relative inline-flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Cart</span>
              {cartCount ? (
                <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--fk-yellow)] px-1 text-[10px] font-bold text-slate-900">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>

      {/* Category Navigation with Dropdowns — use onClick for reliable navigation */}
      <div className="border-b border-slate-200 bg-white">
        <nav className="page-shell flex overflow-x-auto px-3 text-sm text-slate-900">
          {categoryNavConfig.map((config) => (
            <div key={config.label} className="category-nav-item shrink-0">
              <a
                href="#"
                onClick={(e) => handleCategoryClick(e, config)}
                className={`flex items-center gap-1 px-4 py-3 font-medium transition hover:text-[var(--fk-blue)] ${
                  config.featured ? 'text-[var(--fk-blue)] font-semibold' : ''
                }`}
              >
                {config.label}
                {config.subcategories?.length ? (
                  <ChevronDown className="h-3 w-3" />
                ) : null}
              </a>
              {config.subcategories?.length ? (
                <div className="category-dropdown">
                  {config.subcategories.map((sub) => (
                    <a
                      key={sub.label}
                      href="#"
                      onClick={(e) => handleSubcategoryClick(e, config, sub)}
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

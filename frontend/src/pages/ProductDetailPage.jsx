import { ChevronRight, Heart, ShoppingBag, ShoppingCart, Tag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import StarRating from '@/components/common/StarRating';
import SpecTable from '@/components/product/SpecTable';
import ROUTES from '@/constants/routes';
import useCart from '@/hooks/useCart';
import useProduct from '@/hooks/useProduct';
import { addRecentlyVisited, useRecentlyVisited } from '@/hooks/useRecentlyVisited';
import useWishlist from '@/hooks/useWishlist';
import calcDiscount from '@/utils/calcDiscount';
import noImage from '@/assets/images/no-image.png';
import ProductRow from '@/components/home/ProductRow';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/constants/queryKeys';
import productService from '@/services/productService';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { products: recentlyVisitedRaw } = useRecentlyVisited();

  const { data: similarData } = useQuery({
    queryKey: queryKeys.products.list({ categoryId: product?.categoryId, limit: 12 }),
    queryFn: () => productService.getProducts({ categoryId: product.categoryId, limit: 12 }),
    enabled: !!product?.categoryId,
  });

  const similarProducts = (similarData?.products || []).filter((p) => String(p.id) !== String(product?.id));
  const recentlyVisitedProducts = recentlyVisitedRaw.filter((p) => String(p.id) !== String(product?.id));

  // Track recently visited product in localStorage and set page title
  useEffect(() => {
    if (product) {
      addRecentlyVisited(product);
      document.title = `${product.name} | Flipkart Clone`;
    }
    
    // Cleanup title on unmount
    return () => {
      document.title = 'Flipkart Clone';
    };
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const discount = calcDiscount(product.price, product.mrp);

  const requireAuth = () => {
    navigate(ROUTES.login);
  };

  const displayImages = product.images?.length ? product.images : [{ url: noImage, altText: product.name }];
  const activeImage = displayImages[activeImageIndex] || displayImages[0];

  // For iPhone styling demo block
  const isIphone = product.name?.toLowerCase().includes('iphone');

  return (
    <div className="bg-slate-50 min-h-screen py-4 animate-fade-in-up">
      <div className="page-shell">
        <div className="bg-white p-4 sm:p-6 shadow-sm rounded-sm">
          <div className="grid gap-6 lg:grid-cols-[40%_60%] xl:grid-cols-[45%_55%]">
            {/* LEFT COLUMN: Gallery & Actions */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="flex flex-col-reverse md:flex-row gap-4 mb-4">
                {/* Vertical Thumbs (Horizontal on Mobile) */}
                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto w-full md:w-16 shrink-0 h-auto md:h-[480px] p-1 py-2 md:py-1 scrollbar-hide">
                  {displayImages.map((image, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setActiveImageIndex(i)}
                      onClick={() => setActiveImageIndex(i)}
                      className={`shrink-0 overflow-hidden bg-white border outline-none transition-all flex items-center justify-center ${
                        activeImageIndex === i ? 'border-[#2874f0]' : 'border-slate-200'
                      }`}
                      style={{ width: '60px', height: '60px' }}
                    >
                      <img
                        src={image.url || noImage}
                        alt={`Thumb ${i}`}
                        className="max-h-full max-w-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>

                {/* Main Image Box */}
                <div className="relative flex-1 flex items-center justify-center border border-slate-100 p-4 sm:p-8 h-[300px] sm:h-[400px] md:h-[480px]">
                  <button
                    type="button"
                    onClick={() => (token ? toggleWishlist(product.id, isWishlisted) : requireAuth())}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-50 border border-slate-200 shadow-sm transition hover:shadow-md"
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>
                  <img
                    src={activeImage?.url || noImage}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  style={{ backgroundColor: '#ff9f00', border: 'none' }}
                  className="rounded-sm py-4 text-white text-[15px] font-semibold gap-2 shadow-sm uppercase tracking-wide"
                  onClick={() => (token ? addItem({ productId: product.id, quantity: 1 }) : requireAuth())}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  style={{ backgroundColor: '#fb641b', border: 'none' }}
                  className="rounded-sm py-4 text-white text-[15px] font-semibold gap-2 shadow-sm uppercase tracking-wide"
                  onClick={async () => {
                    if (!token) {
                      requireAuth();
                      return;
                    }
                    const result = await addItem({ productId: product.id, quantity: 1 });
                    if (result) navigate(ROUTES.checkout);
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Buy Now
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN: Details */}
            <div className="space-y-4 px-2 pb-10">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[12px] text-slate-500 mb-2">
                <Link to={ROUTES.home} className="hover:text-[#2874f0]">Home</Link>
                <ChevronRight className="h-3 w-3" />
                {product.category && (
                  <>
                    <Link to={`${ROUTES.products}?categoryId=${product.categoryId}`} className="hover:text-[#2874f0]">
                      {product.category.name}
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                  </>
                )}
                <span className="text-slate-500 truncate">{product.brand}</span>
              </div>

              <h1 className="text-lg font-normal text-slate-900 leading-snug">{product.name}</h1>

              <div className="flex items-center gap-3">
                <StarRating rating={product.rating} reviews={product.reviewCount} />
                <span className="text-sm font-semibold text-slate-500 shadow-sm bg-slate-100 rounded-sm px-2 py-0.5">
                  {product.brand}
                </span>
              </div>

              <div className="text-emerald-700 font-semibold text-sm pt-2">Extra ₹{Math.floor(product.mrp - product.price)} off</div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-slate-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
                <span className="text-base text-slate-500 line-through">₹{Number(product.mrp).toLocaleString('en-IN')}</span>
                {discount && (
                  <span className="text-[15px] font-bold text-emerald-700">{discount}% off</span>
                )}
              </div>

              {/* Offers */}
              <div className="space-y-3 mt-4">
                <h3 className="font-semibold text-[15px] text-slate-900 mb-1">Available offers</h3>
                {[
                  { label: 'Bank Offer', desc: '10% instant discount on ICICI Bank Credit Cards, up to ₹1,500 on orders of ₹5,000 and above', tc: 'T&C' },
                  { label: 'Bank Offer', desc: '5% Cashback on Flipkart Axis Bank Card', tc: 'T&C' },
                  { label: 'No cost EMI', desc: `₹${Math.round(Number(product.price) / 12).toLocaleString('en-IN')}/month. Standard EMI also available`, tc: 'View Plans' }
                ].map((offer, idx) => (
                  <div key={idx} className="flex gap-2 text-sm items-start">
                    <Tag className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-slate-700 leading-tight">
                      <span className="font-bold">{offer.label}</span> {offer.desc} <span className="text-[#2874f0] font-medium cursor-pointer">{offer.tc}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Description Mock Block */}
              <div className="mt-8 border border-slate-200 rounded-sm overflow-hidden bg-white shadow-sm">
                <div className="p-6 space-y-3">
                  <h2 className="text-[17px] font-bold text-slate-800">
                    {isIphone ? 'Forged in Titanium.' : product.brand + ' Highlights'}
                  </h2>
                  <p className="text-[15px] text-slate-700 leading-relaxed">
                    {isIphone
                      ? 'iPhone 15 Pro is the first iPhone to feature an aerospace-grade titanium design, using the same alloy that spacecraft use for missions to Mars. Titanium has one of the best strength-to-weight ratios of any metal, making these our lightest Pro models ever.'
                      : product.description}
                  </p>
                  {isIphone && (
                    <div className="mt-4 relative bg-black aspect-video rounded-md overflow-hidden flex items-center justify-center">
                      <img
                        src={activeImage?.url}
                        alt="Product Highlight"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 scale-150 blur-sm"
                      />
                      <img src={activeImage?.url} className="z-10 h-3/4 object-contain shadow-2xl drop-shadow-2xl brightness-110" />
                      <div className="absolute bottom-4 left-4 z-20 text-[10px] sm:text-xs font-semibold tracking-widest text-white/90 uppercase">
                        Titanium design. Sturdy. Lightweight.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications Section */}
              <div className="mt-6">
                <SpecTable specs={product.specs} />
              </div>

            </div>
          </div>
        </div>

        {/* --- SUPPLEMENTAL OUT-OF-BOX SECTIONS --- */}
        <div className="mt-4 space-y-4 pb-10">
          {similarProducts.length > 0 && (
            <ProductRow title="Similar Products" products={similarProducts} />
          )}

          {recentlyVisitedProducts.length > 0 && (
            <ProductRow title="Recently Viewed" products={recentlyVisitedProducts} />
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductDetailPage;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BannerCarousel from '@/components/home/BannerCarousel';
import CategoryStrip from '@/components/home/CategoryStrip';
import ProductRow from '@/components/home/ProductRow';
import ROUTES from '@/constants/routes';
import { useCategories } from '@/hooks/useProducts';
import { useRecentlyVisited } from '@/hooks/useRecentlyVisited';
import productService from '@/services/productService';
import queryKeys from '@/constants/queryKeys';

function HomePage() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { products: recentlyVisited, refresh: refreshRecent } = useRecentlyVisited();

  // Refresh recently visited when homepage mounts (e.g. user navigated back)
  useEffect(() => {
    refreshRecent();
  }, [refreshRecent]);

  // Fetch ALL products (no category filter) — always shows something
  const { data: allProductsData } = useQuery({
    queryKey: queryKeys.products.list({ limit: 20, sort: 'newest' }),
    queryFn: () => productService.getProducts({ limit: 20, sort: 'newest' }),
  });

  const { data: electronicsData } = useQuery({
    queryKey: ['home-electronics'],
    queryFn: () => {
      const cat = categories.find((c) => c.name === 'Electronics');
      if (!cat) return { products: [] };
      return productService.getProducts({ categoryId: cat.id, limit: 12 });
    },
    enabled: categories.length > 0,
  });

  const { data: fashionData } = useQuery({
    queryKey: ['home-fashion'],
    queryFn: () => {
      const menCat = categories.find((c) => c.name === "Men's Fashion");
      const womenCat = categories.find((c) => c.name === "Women's Fashion");
      const catId = menCat?.id || womenCat?.id;
      if (!catId) return { products: [] };
      return productService.getProducts({ categoryId: catId, limit: 12 });
    },
    enabled: categories.length > 0,
  });

  const { data: mobilesData } = useQuery({
    queryKey: ['home-mobiles'],
    queryFn: () => {
      const cat = categories.find((c) => c.name === 'Mobiles');
      if (!cat) return { products: [] };
      return productService.getProducts({ categoryId: cat.id, limit: 12 });
    },
    enabled: categories.length > 0,
  });

  const { data: homeKitchenData } = useQuery({
    queryKey: ['home-kitchen'],
    queryFn: () => {
      const cat = categories.find((c) => c.name === 'Home & Kitchen');
      if (!cat) return { products: [] };
      return productService.getProducts({ categoryId: cat.id, limit: 12 });
    },
    enabled: categories.length > 0,
  });

  const { data: sportsData } = useQuery({
    queryKey: ['home-sports'],
    queryFn: () => {
      const cat = categories.find((c) => c.name === 'Sports & Fitness');
      if (!cat) return { products: [] };
      return productService.getProducts({ categoryId: cat.id, limit: 12 });
    },
    enabled: categories.length > 0,
  });

  const getViewAllLink = (categoryName) => {
    const cat = categories.find((c) => c.name === categoryName);
    return cat ? `${ROUTES.products}?categoryId=${cat.id}` : ROUTES.products;
  };

  const allProducts = allProductsData?.products || [];

  return (
    <div className="space-y-3">
      {/* Category Strip */}
      <CategoryStrip categories={categories} isLoading={categoriesLoading} />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Deals of the Day — shows all newest products as default */}
      {allProducts.length > 0 && (
        <ProductRow
          title="Deals of the Day"
          subtitle="Top picks at unbeatable prices"
          products={allProducts.slice(0, 12)}
          viewAllLink={ROUTES.products}
        />
      )}

      {/* Recently Visited — Flipkart-style */}
      {recentlyVisited.length > 0 && (
        <ProductRow
          title="Recently Visited"
          subtitle="Your browsing history"
          products={recentlyVisited}
        />
      )}

      {/* Best of Mobiles */}
      {(mobilesData?.products?.length || 0) > 0 && (
        <ProductRow
          title="Best of Mobiles"
          subtitle="Top smartphones with amazing offers"
          products={mobilesData.products}
          viewAllLink={getViewAllLink('Mobiles')}
        />
      )}

      {/* Best of Electronics */}
      {(electronicsData?.products?.length || 0) > 0 && (
        <ProductRow
          title="Best of Electronics"
          subtitle="Laptops, headphones, speakers & more"
          products={electronicsData.products}
          viewAllLink={getViewAllLink('Electronics')}
        />
      )}

      {/* Fashion Top Picks */}
      {(fashionData?.products?.length || 0) > 0 && (
        <ProductRow
          title="Fashion Top Picks"
          subtitle="Trending styles for men & women"
          products={fashionData.products}
          viewAllLink={getViewAllLink("Men's Fashion")}
        />
      )}

      {/* Home & Kitchen Essentials */}
      {(homeKitchenData?.products?.length || 0) > 0 && (
        <ProductRow
          title="Home & Kitchen Essentials"
          subtitle="Cookware, appliances & decor"
          products={homeKitchenData.products}
          viewAllLink={getViewAllLink('Home & Kitchen')}
        />
      )}

      {/* Sports & Fitness */}
      {(sportsData?.products?.length || 0) > 0 && (
        <ProductRow
          title="Sports, Fitness & Outdoors"
          subtitle="Gear up for your best performance"
          products={sportsData.products}
          viewAllLink={getViewAllLink('Sports & Fitness')}
        />
      )}

      {/* All Products grid at bottom */}
      {allProducts.length > 12 && (
        <ProductRow
          title="More Products to Explore"
          subtitle="Discover something new today"
          products={allProducts.slice(12)}
          viewAllLink={ROUTES.products}
        />
      )}
    </div>
  );
}

export default HomePage;

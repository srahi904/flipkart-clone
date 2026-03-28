import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/constants/queryKeys';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';

export const useProducts = (params) =>
  useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productService.getProducts(params),
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: queryKeys.products.list({ featured: 'true', limit: 8 }),
    queryFn: () => productService.getProducts({ featured: 'true', limit: 8 }),
  });

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryService.getCategories,
  });

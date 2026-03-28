import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/constants/queryKeys';
import productService from '@/services/productService';

const useProduct = (id) =>
  useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });

export default useProduct;

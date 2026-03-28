import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import wishlistService from '@/services/wishlistService';
import queryKeys from '@/constants/queryKeys';
import { syncWishlist, clearWishlistState } from '@/store/slices/wishlistSlice';
import { addToast } from '@/store/slices/uiSlice';

const useWishlist = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: wishlistService.getWishlist,
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (wishlistQuery.data) {
      dispatch(syncWishlist(wishlistQuery.data));
    }
  }, [wishlistQuery.data, dispatch]);

  const syncAndToast = (items, message) => {
    dispatch(syncWishlist(items));
    queryClient.setQueryData(queryKeys.wishlist, items);

    if (message) {
      dispatch(addToast({ variant: 'success', message }));
    }
  };

  const addItem = useMutation({
    mutationFn: wishlistService.addItem,
    onSuccess: (items) => syncAndToast(items, 'Added to wishlist'),
    onError: (error) => dispatch(addToast({ variant: 'error', message: error.message })),
  });

  const removeItem = useMutation({
    mutationFn: wishlistService.removeItem,
    onSuccess: (items) => syncAndToast(items, 'Removed from wishlist'),
    onError: (error) => dispatch(addToast({ variant: 'error', message: error.message })),
  });

  const toggleWishlist = async (productId, isWishlisted) => {
    try {
      if (isWishlisted) {
        return await removeItem.mutateAsync(productId);
      }

      return await addItem.mutateAsync(productId);
    } catch {
      return null;
    }
  };

  const resetWishlist = () => {
    dispatch(clearWishlistState());
    queryClient.removeQueries({ queryKey: queryKeys.wishlist });
  };

  return {
    wishlist: wishlistQuery.data || [],
    wishlistIds: (wishlistQuery.data || []).map((entry) => entry.productId || entry.product?.id),
    isLoading: wishlistQuery.isLoading,
    toggleWishlist,
    resetWishlist,
  };
};

export default useWishlist;

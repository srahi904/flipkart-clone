import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import queryKeys from '@/constants/queryKeys';
import cartService from '@/services/cartService';
import { syncCart, clearCartState } from '@/store/slices/cartSlice';
import { addToast } from '@/store/slices/uiSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const cartQuery = useQuery({
    queryKey: queryKeys.cart,
    queryFn: cartService.getCart,
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (cartQuery.data) {
      dispatch(syncCart(cartQuery.data));
    }
  }, [cartQuery.data, dispatch]);

  const syncAndToast = (cart, message) => {
    dispatch(syncCart(cart));
    queryClient.setQueryData(queryKeys.cart, cart);

    if (message) {
      dispatch(addToast({ variant: 'success', message }));
    }
  };

  const addItem = useMutation({
    mutationFn: cartService.addItem,
    onSuccess: (cart) => syncAndToast(cart, 'Product added to cart'),
    onError: (error) => dispatch(addToast({ variant: 'error', message: error.message })),
  });

  const updateItem = useMutation({
    mutationFn: ({ itemId, payload }) => cartService.updateItem(itemId, payload),
    onSuccess: (cart) => syncAndToast(cart, 'Cart updated'),
    onError: (error) => dispatch(addToast({ variant: 'error', message: error.message })),
  });

  const removeItem = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: (cart) => syncAndToast(cart, 'Item removed from cart'),
    onError: (error) => dispatch(addToast({ variant: 'error', message: error.message })),
  });

  const resetCart = () => {
    dispatch(clearCartState());
    queryClient.removeQueries({ queryKey: queryKeys.cart });
  };

  const safeAddItem = async (payload) => {
    try {
      return await addItem.mutateAsync(payload);
    } catch {
      return null;
    }
  };

  const safeUpdateItem = async (payload) => {
    try {
      return await updateItem.mutateAsync(payload);
    } catch {
      return null;
    }
  };

  const safeRemoveItem = async (itemId) => {
    try {
      return await removeItem.mutateAsync(itemId);
    } catch {
      return null;
    }
  };

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isFetching: cartQuery.isFetching,
    refetchCart: cartQuery.refetch,
    addItem: safeAddItem,
    updateItem: safeUpdateItem,
    removeItem: safeRemoveItem,
    resetCart,
  };
};

export default useCart;

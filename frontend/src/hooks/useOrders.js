import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import orderService from '@/services/orderService';
import queryKeys from '@/constants/queryKeys';
import { addToast } from '@/store/slices/uiSlice';

const useOrders = (orderId) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const token = useSelector((state) => state.auth.token);

  const ordersQuery = useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: orderService.getOrders,
    enabled: Boolean(token),
  });

  const orderQuery = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderService.getOrderById(orderId),
    enabled: Boolean(token && orderId),
  });

  const placeOrder = useMutation({
    mutationFn: orderService.placeOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.removeQueries({ queryKey: queryKeys.cart });
      dispatch(addToast({ variant: 'success', message: 'Order placed successfully' }));
      queryClient.setQueryData(queryKeys.orders.detail(order.id), order);
    },
    onError: (error) => dispatch(addToast({ variant: 'error', message: error.message })),
  });

  const safePlaceOrder = async (payload) => {
    try {
      return await placeOrder.mutateAsync(payload);
    } catch {
      return null;
    }
  };

  return {
    orders: ordersQuery.data || [],
    order: orderQuery.data,
    isOrdersLoading: ordersQuery.isLoading,
    isOrderLoading: orderQuery.isLoading,
    placeOrder: safePlaceOrder,
  };
};

export default useOrders;

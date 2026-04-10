import api from './api';

const orderService = {
  async placeOrder(payload) {
    const { data } = await api.post('/orders', payload);
    return data.data;
  },
  async getOrders() {
    const { data } = await api.get('/orders');
    return data.data;
  },
  async getOrderById(orderId) {
    const { data } = await api.get(`/orders/${orderId}`);
    return data.data;
  },
  async initRazorpay() {
    const { data } = await api.post('/orders/razorpay-init');
    return data.data;
  },
};

export default orderService;

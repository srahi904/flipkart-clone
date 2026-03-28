import api from './api';

const cartService = {
  async getCart() {
    const { data } = await api.get('/cart');
    return data.data;
  },
  async addItem(payload) {
    const { data } = await api.post('/cart/items', payload);
    return data.data;
  },
  async updateItem(itemId, payload) {
    const { data } = await api.put(`/cart/items/${itemId}`, payload);
    return data.data;
  },
  async removeItem(itemId) {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data.data;
  },
};

export default cartService;

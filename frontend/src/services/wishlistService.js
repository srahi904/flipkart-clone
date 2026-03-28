import api from './api';

const wishlistService = {
  async getWishlist() {
    const { data } = await api.get('/wishlist');
    return data.data;
  },
  async addItem(productId) {
    const { data } = await api.post('/wishlist', { productId });
    return data.data;
  },
  async removeItem(productId) {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return data.data;
  },
};

export default wishlistService;

import api from './api';

const productService = {
  async getProducts(params = {}) {
    const { data } = await api.get('/products', { params });
    return data.data;
  },
  async getProductById(id) {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },
};

export default productService;

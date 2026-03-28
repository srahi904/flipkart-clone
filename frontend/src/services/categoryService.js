import api from './api';

const categoryService = {
  async getCategories() {
    const { data } = await api.get('/categories');
    return data.data;
  },
};

export default categoryService;

const queryKeys = {
  categories: ['categories'],
  products: {
    all: ['products'],
    list: (params) => ['products', params],
    detail: (id) => ['products', id],
  },
  cart: ['cart'],
  orders: {
    all: ['orders'],
    detail: (id) => ['orders', id],
  },
  wishlist: ['wishlist'],
  auth: ['auth', 'me'],
};

export default queryKeys;

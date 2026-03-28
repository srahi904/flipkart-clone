const AUTH_KEY = 'flipkart-auth';
const CART_KEY = 'flipkart-cart';
const WISHLIST_KEY = 'flipkart-wishlist';

export const loadPersistedState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return {
    auth: JSON.parse(localStorage.getItem(AUTH_KEY) || 'null') || undefined,
    cart: JSON.parse(localStorage.getItem(CART_KEY) || 'null') || undefined,
    wishlist: JSON.parse(localStorage.getItem(WISHLIST_KEY) || 'null') || undefined,
  };
};

const localStorageSync = (store) => (next) => (action) => {
  const result = next(action);

  if (typeof window === 'undefined') {
    return result;
  }

  const state = store.getState();

  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      token: state.auth.token,
      user: state.auth.user,
    }),
  );
  localStorage.setItem(
    CART_KEY,
    JSON.stringify({
      items: state.cart.items,
      summary: state.cart.summary,
    }),
  );
  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify({
      ids: state.wishlist.ids,
      items: state.wishlist.items,
    }),
  );

  return result;
};

export default localStorageSync;

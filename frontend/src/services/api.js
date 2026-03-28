import axios from 'axios';
import store from '@/store';
import { clearSession } from '@/store/slices/authSlice';
import { clearCartState } from '@/store/slices/cartSlice';
import { clearWishlistState } from '@/store/slices/wishlistSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isLoggingOut = false;

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('flipkart-auth') || 'null');

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Globally handle 401 unauthorized errors (e.g., token expired, or DB seeded wiping out users)
    if (error.response?.status === 401) {
      if (!isLoggingOut) {
        isLoggingOut = true;
        // Purge user session and all specific state
        store.dispatch(clearSession());
        store.dispatch(clearCartState());
        store.dispatch(clearWishlistState());
        
        // Reset flag briefly 
        setTimeout(() => { isLoggingOut = false }, 1000);
      }
      return Promise.reject(new Error('Your session has expired. Please login again.'));
    }

    const data = error.response?.data;
    let message = data?.message || error.message || 'Something went wrong';

    // Extract detailed Zod validation errors if present from the Express backend
    if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError === 'object' && firstError.message) {
        // e.g. "body.address.phone: String must contain at least 10 character(s)"
        const pathStr = firstError.path ? `(${firstError.path.split('.').pop()}): ` : '';
        message = `${pathStr}${firstError.message}`;
      } else if (typeof firstError === 'string') {
        message = firstError;
      }
    }

    return Promise.reject(new Error(message));
  },
);

export default api;

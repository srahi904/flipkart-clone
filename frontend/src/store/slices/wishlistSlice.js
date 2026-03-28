import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    ids: [],
    items: [],
  },
  reducers: {
    syncWishlist(state, action) {
      state.items = action.payload || [];
      state.ids = (action.payload || []).map((entry) => entry.productId || entry.product?.id);
    },
    clearWishlistState(state) {
      state.ids = [];
      state.items = [];
    },
  },
});

export const { syncWishlist, clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;

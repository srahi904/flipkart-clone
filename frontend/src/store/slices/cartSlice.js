import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  summary: {
    totalItems: 0,
    subtotal: 0,
    originalTotal: 0,
    savings: 0,
    shipping: 0,
    total: 0,
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    syncCart(state, action) {
      state.items = action.payload?.items || [];
      state.summary = action.payload?.summary || initialState.summary;
    },
    clearCartState(state) {
      state.items = [];
      state.summary = initialState.summary;
    },
  },
});

export const { syncCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;

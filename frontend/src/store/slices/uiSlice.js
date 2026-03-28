import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    mobileFiltersOpen: false,
  },
  reducers: {
    addToast(state, action) {
      state.toasts.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        variant: action.payload.variant || 'success',
        message: action.payload.message,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    setMobileFiltersOpen(state, action) {
      state.mobileFiltersOpen = action.payload;
    },
  },
});

export const { addToast, removeToast, setMobileFiltersOpen } = uiSlice.actions;
export default uiSlice.reducer;

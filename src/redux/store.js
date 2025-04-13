import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemSlice';

const store = configureStore({
  reducer: {
    items: itemsReducer,
  },
});

export default store;

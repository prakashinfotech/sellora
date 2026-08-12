import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adsReducer from './slices/adsSlice';
import categoriesReducer from './slices/categoriesSlice';
import favouritesReducer from './slices/favouritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ads: adsReducer,
    categories: categoriesReducer,
    favourites: favouritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

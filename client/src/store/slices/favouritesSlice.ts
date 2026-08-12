import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchFavourites, toggleFavourite } from '../../services/favourites.service';

interface Favourite {
  id: number;
  userId: number;
  adId: number;
  ad: any;
}

interface FavouritesState {
  favourites: Favourite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouritesState = {
  favourites: [],
  loading: false,
  error: null,
};

export const fetchFavouritesHandler: any = createAsyncThunk(
  'favourites/fetchAll',
  (_: void, { rejectWithValue }) =>
    fetchFavourites().catch((error) => error && rejectWithValue(error))
);

export const toggleFavouriteHandler: any = createAsyncThunk(
  'favourites/toggle',
  (adId: number, { rejectWithValue }) =>
    toggleFavourite(adId)
      .then((result) => ({ adId, saved: result.saved }))
      .catch((error) => error && rejectWithValue(error))
);

const favouritesSlice = createSlice({
  name: 'favouritesSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavouritesHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavouritesHandler.fulfilled, (state, action: PayloadAction<Favourite[]>) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavouritesHandler.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(toggleFavouriteHandler.fulfilled, (state, action: PayloadAction<{ adId: number; saved: boolean }>) => {
        if (!action.payload.saved) {
          state.favourites = state.favourites.filter((f) => f.adId !== action.payload.adId);
        }
      });
  },
});

export default favouritesSlice.reducer;

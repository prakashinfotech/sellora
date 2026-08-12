import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAllAds,
  fetchAdById,
  fetchMyAds,
  createAd,
  updateAd,
  deleteAd,
  AdFilters,
  CreateAdPayload,
} from '../../services/ads.service';

interface Ad {
  id: number;
  title: string;
  description?: string;
  price: number;
  images: string[];
  categoryId: number;
  userId: number;
  city?: string;
  state?: string;
  status: string;
  views: number;
  createdAt: string;
  category?: { id: number; name: string; slug: string };
  user?: { id: number; name: string; phone?: string; city?: string; avatar?: string };
}

interface AdsState {
  ads: Ad[];
  currentAd: Ad | null;
  myAds: Ad[];
  total: number;
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: AdsState = {
  ads: [],
  currentAd: null,
  myAds: [],
  total: 0,
  page: 1,
  loading: false,
  error: null,
};

export const fetchAllAdsHandler: any = createAsyncThunk(
  'ads/fetchAll',
  (filters: AdFilters, { rejectWithValue }) =>
    fetchAllAds(filters).catch((error) => error && rejectWithValue(error))
);

export const fetchAdByIdHandler: any = createAsyncThunk(
  'ads/fetchById',
  (id: number, { rejectWithValue }) =>
    fetchAdById(id).catch((error) => error && rejectWithValue(error))
);

export const fetchMyAdsHandler: any = createAsyncThunk(
  'ads/fetchMy',
  (_: void, { rejectWithValue }) =>
    fetchMyAds().catch((error) => error && rejectWithValue(error))
);

export const createAdHandler: any = createAsyncThunk(
  'ads/create',
  (data: CreateAdPayload, { rejectWithValue }) =>
    createAd(data).catch((error) => error && rejectWithValue(error))
);

export const updateAdHandler: any = createAsyncThunk(
  'ads/update',
  (data: { id: number; payload: Partial<CreateAdPayload> & { status?: string } }, { rejectWithValue }) =>
    updateAd(data.id, data.payload).catch((error) => error && rejectWithValue(error))
);

export const deleteAdHandler: any = createAsyncThunk(
  'ads/delete',
  (id: number, { rejectWithValue }) =>
    deleteAd(id).catch((error) => error && rejectWithValue(error))
);

const adsSlice = createSlice({
  name: 'adsSlice',
  initialState,
  reducers: {
    clearCurrentAd: (state) => {
      state.currentAd = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdsHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdsHandler.fulfilled, (state, action: PayloadAction<{ data: Ad[]; total: number; page: number }>) => {
        state.loading = false;
        state.ads = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchAllAdsHandler.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchAdByIdHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdByIdHandler.fulfilled, (state, action: PayloadAction<Ad>) => {
        state.loading = false;
        state.currentAd = action.payload;
      })
      .addCase(fetchAdByIdHandler.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(fetchMyAdsHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAdsHandler.fulfilled, (state, action: PayloadAction<Ad[]>) => {
        state.loading = false;
        state.myAds = action.payload;
      })
      .addCase(fetchMyAdsHandler.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(createAdHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdHandler.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAdHandler.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateAdHandler.fulfilled, (state, action: PayloadAction<Ad>) => {
        state.myAds = state.myAds.map((ad) =>
          ad.id === action.payload.id ? action.payload : ad
        );
      });

    builder
      .addCase(deleteAdHandler.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdHandler.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAdHandler.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCurrentAd } = adsSlice.actions;
export default adsSlice.reducer;

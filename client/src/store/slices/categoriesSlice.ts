import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCategories } from '../../services/categories.service';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  parentId?: number;
  subcategories?: Category[];
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategoriesHandler: any = createAsyncThunk(
  'categories/fetchAll',
  (_: void, { rejectWithValue }) =>
    fetchCategories().catch((error) => error && rejectWithValue(error))
);

const categoriesSlice = createSlice({
  name: 'categoriesSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesHandler.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesHandler.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesHandler.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categoriesSlice.reducer;

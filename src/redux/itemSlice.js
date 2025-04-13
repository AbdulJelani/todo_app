import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRequest from '../apiRequest';

const API_URL = 'http://localhost:3500/items';

export const fetchItems = createAsyncThunk('items/fetchItems', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addItem = createAsyncThunk('items/addItem', async (item, { getState, rejectWithValue }) => {
  const items = getState().items.items;
  const id = items.length ? items[items.length - 1].id + 1 : 1;
  const newItem = { id, checked: false, item };

  const postOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  };

  const result = await apiRequest(API_URL, postOptions);
  if (result) return rejectWithValue(result);
  return newItem;
});

export const toggleCheck = createAsyncThunk('items/toggleCheck', async (id, { getState, rejectWithValue }) => {
  const item = getState().items.items.find(i => i.id === id);
  const updateOptions = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checked: !item.checked }),
  };

  const result = await apiRequest(`${API_URL}/${id}`, updateOptions);
  if (result) return rejectWithValue(result);
  return id;
});

export const deleteItem = createAsyncThunk('items/deleteItem', async (id, { rejectWithValue }) => {
  const deleteOptions = { method: 'DELETE' };
  const result = await apiRequest(`${API_URL}/${id}`, deleteOptions);
  if (result) return rejectWithValue(result);
  return id;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(toggleCheck.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload);
        if (item) item.checked = !item.checked;
      })
      .addCase(toggleCheck.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload;
      })
  }
});

export default itemsSlice.reducer;

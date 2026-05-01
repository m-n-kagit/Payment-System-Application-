import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHistory = createAsyncThunk('history/fetchHistory', async () => {
  const response = await axios.get('http://localhost:5000/api/history');
  return response.data;
});

const historySlice = createSlice({
  name: 'history',
  initialState: {
    records: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addHistoryRecord: (state, action) => {
      state.records.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.records = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addHistoryRecord } = historySlice.actions;
export default historySlice.reducer;

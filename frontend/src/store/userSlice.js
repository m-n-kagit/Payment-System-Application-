import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await axios.get('http://localhost:5000/api/user');
  return response.data;
});

export const fetchOwner = createAsyncThunk('user/fetchOwner', async () => {
  const response = await axios.get('http://localhost:5000/api/owner');
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    owner: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    updateBalance: (state, action) => {
      if (state.data) {
        state.data.balance = action.payload;
      }
    },
    updateOwnerEarnings: (state, action) => {
      if (state.owner) {
        state.owner.earnings += action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchOwner.fulfilled, (state, action) => {
        state.owner = action.payload;
      });
  },
});

export const { updateBalance, updateOwnerEarnings } = userSlice.actions;
export default userSlice.reducer;

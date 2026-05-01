import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import historyReducer from './historySlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    history: historyReducer,
  },
});

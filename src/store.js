// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userSlice';

const store = configureStore({
  reducer: {
    users: userReducer
  }
});

export default store;

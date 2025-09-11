import { configureStore } from '@reduxjs/toolkit';
import dddSlice from './dddSlice';
import projectSlice from './projectSlice';
import screenSlice from './screenSlice';

export const store = configureStore({
  reducer: {
    project: projectSlice,
    ddd: dddSlice,
    screen: screenSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

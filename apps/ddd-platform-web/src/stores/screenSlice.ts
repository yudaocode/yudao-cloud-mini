import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AmisSchema {
  type: string;
  [key: string]: any;
}

export interface Screen {
  id: string;
  name: string;
  type: 'list' | 'form' | 'detail' | 'dashboard';
  projectId: string;
  entityId?: string;
  schema: AmisSchema;
  createdAt: string;
  updatedAt: string;
}

interface ScreenState {
  screens: Screen[];
  currentScreen: Screen | null;
  loading: boolean;
  error: string | null;
}

const initialState: ScreenState = {
  screens: [],
  currentScreen: null,
  loading: false,
  error: null,
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setScreens: (state, action: PayloadAction<Screen[]>) => {
      state.screens = action.payload;
    },
    addScreen: (state, action: PayloadAction<Screen>) => {
      state.screens.push(action.payload);
    },
    updateScreen: (state, action: PayloadAction<Screen>) => {
      const index = state.screens.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.screens[index] = action.payload;
      }
    },
    removeScreen: (state, action: PayloadAction<string>) => {
      state.screens = state.screens.filter(s => s.id !== action.payload);
    },
    setCurrentScreen: (state, action: PayloadAction<Screen>) => {
      state.currentScreen = action.payload;
    },
    clearCurrentScreen: (state) => {
      state.currentScreen = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setScreens,
  addScreen,
  updateScreen,
  removeScreen,
  setCurrentScreen,
  clearCurrentScreen,
  setLoading,
  setError,
} = screenSlice.actions;

export default screenSlice.reducer;

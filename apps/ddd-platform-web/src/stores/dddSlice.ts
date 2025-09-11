import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DDDEntity {
  id: string;
  name: string;
  attributes: DDDAttribute[];
  aggregateId: string;
}

export interface DDDAttribute {
  id: string;
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface Aggregate {
  id: string;
  name: string;
  description: string;
  entities: DDDEntity[];
  boundedContextId: string;
}

interface DDDState {
  aggregates: Aggregate[];
  currentAggregate: Aggregate | null;
  loading: boolean;
  error: string | null;
}

const initialState: DDDState = {
  aggregates: [],
  currentAggregate: null,
  loading: false,
  error: null,
};

const dddSlice = createSlice({
  name: 'ddd',
  initialState,
  reducers: {
    setAggregates: (state, action: PayloadAction<Aggregate[]>) => {
      state.aggregates = action.payload;
    },
    addAggregate: (state, action: PayloadAction<Aggregate>) => {
      state.aggregates.push(action.payload);
    },
    updateAggregate: (state, action: PayloadAction<Aggregate>) => {
      const index = state.aggregates.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.aggregates[index] = action.payload;
      }
    },
    removeAggregate: (state, action: PayloadAction<string>) => {
      state.aggregates = state.aggregates.filter(a => a.id !== action.payload);
    },
    setCurrentAggregate: (state, action: PayloadAction<Aggregate>) => {
      state.currentAggregate = action.payload;
    },
    clearCurrentAggregate: (state) => {
      state.currentAggregate = null;
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
  setAggregates,
  addAggregate,
  updateAggregate,
  removeAggregate,
  setCurrentAggregate,
  clearCurrentAggregate,
  setLoading,
  setError,
} = dddSlice.actions;

export default dddSlice.reducer;

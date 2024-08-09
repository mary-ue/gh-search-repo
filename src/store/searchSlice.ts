import { createSlice } from '@reduxjs/toolkit';
import { fetchRepositories } from './searchAction';

export interface Repository {
  name: string;
  primaryLanguage: { name: string } | null;
  forks: { totalCount: number };
  stargazers: { totalCount: number };
  updatedAt: string;
}

interface SearchState {
  repositories: Repository[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  repositories: null,
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositories.pending, (state) => {
        state.loading = true;
        state.repositories = null;
        state.error = null;
      })
      .addCase(fetchRepositories.fulfilled, (state, action) => {
        state.repositories = action.payload;
        state.loading = false;
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default searchSlice.reducer;

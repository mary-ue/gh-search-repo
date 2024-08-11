import { createSlice } from '@reduxjs/toolkit';
import { fetchRepositories } from './searchAction';

export interface Repository {
  id: string;
  name: string;
  primaryLanguage: { name: string } | null;
  forks: { totalCount: number };
  stargazers: { totalCount: number };
  updatedAt: string;
  description?: string;
  licenseInfo?: { name: string };
  languages: {
    nodes: Array<{ name: string }>;
  };
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

interface SearchState {
  searchData: string;
  count: number;
  repositories: Repository[] | null;
  totalCount: number;
  pageInfo: PageInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  searchData: '',
  count: 10,
  repositories: null,
  totalCount: 0,
  pageInfo: null,
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchData(state, action) {
      state.searchData = action.payload;
    },
    setSearchCount(state, action) {
      state.count = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositories.pending, (state) => {
        state.error = null;
        state.loading = true;
        state.repositories = null;
        state.pageInfo = null; 
      })
      .addCase(fetchRepositories.fulfilled, (state, action) => {
        state.repositories = action.payload.repositories;
        state.pageInfo = action.payload.pageInfo;
        state.totalCount = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setSearchData, setSearchCount } = searchSlice.actions;

export default searchSlice.reducer;

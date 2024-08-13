import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

type SortColumn = 'stars' | 'forks' | 'updated';
type SortDirection = 'asc' | 'desc';

interface SearchState {
  searchData: string;
  count: number;
  repositories: Repository[] | null;
  totalCount: number;
  pageInfo: PageInfo | null;
  loading: boolean;
  error: string | null;
  sortColumn: SortColumn | null;
  sortDirection: SortDirection;
  isSorted: boolean;
  page: number;
}

const initialState: SearchState = {
  searchData: '',
  count: 10,
  repositories: null,
  totalCount: 0,
  pageInfo: null,
  loading: false,
  error: null,
  sortColumn: null,
  sortDirection: 'desc',
  isSorted: false,
  page: 1,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchData(state, action: PayloadAction<string>) {
      state.searchData = action.payload;
    },
    setSearchCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    setSortColumn(state, action: PayloadAction<SortColumn | null>) {
      state.sortColumn = action.payload;
      state.isSorted = action.payload !== null;
    },
    setSortDirection(state, action: PayloadAction<SortDirection>) {
      state.sortDirection = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetSearchState(state) {
      state.searchData = '';
      state.count = 10;
      state.sortColumn = null;
      state.sortDirection = 'desc';
      state.isSorted = false;
      state.repositories = null;
      state.totalCount = 0;
      state.pageInfo = null;
      state.loading = false;
      state.error = null;
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepositories.pending, (state) => {
        state.error = null;
        state.loading = true;
        state.repositories = null;
        state.pageInfo = null;
      })
      .addCase(
        fetchRepositories.fulfilled,
        (
          state,
          action: PayloadAction<{
            repositories: Repository[];
            pageInfo: PageInfo;
            totalCount: number;
          }>
        ) => {
          state.repositories = action.payload.repositories;
          state.pageInfo = action.payload.pageInfo;
          state.totalCount = action.payload.totalCount;
          state.loading = false;
        }
      )
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const {
  setSearchData,
  setSearchCount,
  setSortColumn,
  setSortDirection,
  resetSearchState,
  setPage,
} = searchSlice.actions;

export default searchSlice.reducer;

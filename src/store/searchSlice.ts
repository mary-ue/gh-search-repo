import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRepositories } from './searchAction';

/**
 * Интерфейс репозитория.
 * @property {string} id - Уникальный идентификатор репозитория.
 * @property {string} name - Название репозитория.
 * @property {{ name: string } | null} primaryLanguage - Основной язык программирования, используемый в репозитории.
 * @property {{ totalCount: number }} forks - Общее количество форков репозитория.
 * @property {{ totalCount: number }} stargazers - Общее количество звёзд, поставленных репозиторию.
 * @property {string} updatedAt - Дата последнего обновления репозитория.
 * @property {string | undefined} description - Описание репозитория (опционально).
 * @property {{ name: string } | undefined} licenseInfo - Информация о лицензии репозитория (опционально).
 * @property {{ nodes: Array<{ name: string }> }} languages - Список языков программирования, используемых в репозитории.
 */
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

/**
 * Интерфейс для представления информации о пагинации.
 * @property {string | null} endCursor - Курсор для определения конца текущей страницы.
 * @property {boolean} hasNextPage - Флаг наличия следующей страницы.
 */
export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

/**
 * Типы возможных колонок для сортировки.
 * @type {'stars' | 'forks' | 'updated'}
 */
type SortColumn = 'stars' | 'forks' | 'updated';

/**
 * Типы направлений сортировки.
 * @type {'asc' | 'desc'} - 'asc' по возрастанию, 'desc' по убыванию
 */
type SortDirection = 'asc' | 'desc';

/**
 * Интерфейс состояния поиска.
 * @property {string} searchData - Дынные поискового запроса.
 * @property {number} count - Количество элементов на странице.
 * @property {Repository[] | null} repositories - Список репозиториев.
 * @property {number} totalCount - Общее количество найденных репозиториев.
 * @property {PageInfo | null} pageInfo - Информация о текущей странице (пагинация).
 * @property {boolean} loading - Флаг загрузки.
 * @property {string | null} error - Сообщение об ошибке.
 * @property {SortColumn | null} sortColumn - Колонка, по которой происходит сортировка.
 * @property {SortDirection} sortDirection - Направление сортировки.
 * @property {boolean} isSorted - Флаг, показывающий, применяется ли сортировка.
 * @property {number} page - Номер текущей страницы поиска.
 */
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
    /**
     * Устанавливает строку поиска.
     * @param {SearchState} state - Текущее состояние.
     * @param {PayloadAction<string>} action - Новая строка поиска.
     */
    setSearchData(state, action: PayloadAction<string>) {
      state.searchData = action.payload;
    },
    /**
     * Устанавливает количество элементов (результатов поиска) на странице.
     * @param {SearchState} state - Текущее состояние.
     * @param {PayloadAction<number>} action - Новое количество элементов (результатов поиска).
     */
    setSearchCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    /**
     * Устанавливает колонку для сортировки.
     * @param {SearchState} state - Текущее состояние.
     * @param {PayloadAction<SortColumn | null>} action - Новая колонка для сортировки.
     */
    setSortColumn(state, action: PayloadAction<SortColumn | null>) {
      state.sortColumn = action.payload;
      state.isSorted = action.payload !== null;
    },
    /**
     * Устанавливает направление сортировки.
     * @param {SearchState} state - Текущее состояние.
     * @param {PayloadAction<SortDirection>} action - Новое направление сортировки.
     */
    setSortDirection(state, action: PayloadAction<SortDirection>) {
      state.sortDirection = action.payload;
    },
    /**
     * Устанавливает текущую страницу.
     * @param {SearchState} state - Текущее состояние.
     * @param {PayloadAction<number>} action - Номер текущей страницы.
     */
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    /**
     * Сбрасывает состояние поиска к начальному состоянию.
     * @param {SearchState} state - Текущее состояние.
     */
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

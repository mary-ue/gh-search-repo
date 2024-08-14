import { createAsyncThunk } from '@reduxjs/toolkit';
import { PageInfo, Repository } from './searchSlice';
import { RootState } from './store';

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL!;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN!;

/**
 * Интерфейс ответа от GitHub GraphQL API на запрос поиска репозиториев.
 * @property {Object} data - Основные данные ответа.
 * @property {Object} data.search - Результаты поиска репозиториев.
 * @property {number} data.search.repositoryCount - Общее количество найденных репозиториев.
 * @property {Array<{ node: Repository }>} data.search.edges - Список найденных репозиториев.
 * @property {Object} data.search.pageInfo - Информация о пагинации.
 * @property {string | null} data.search.pageInfo.endCursor - Курсор для следующей страницы результатов (если есть).
 * @property {boolean} data.search.pageInfo.hasNextPage - Флаг наличия следующей страницы результатов.
 */
interface GitHubResponse {
  data: {
    search: {
      repositoryCount: number;
      edges: Array<{
        node: Repository;
      }>;
      pageInfo: {
        endCursor: string | null;
        hasNextPage: boolean;
      };
    };
  };
}

/**
 * Интерфейс данных для запроса поиска репозиториев.
 * @property {string} searchTerm - Строка поиска, введенная пользователем.
 * @property {number} count - Количество репозиториев, запрашиваемых на одной странице.
 * @property {string | null} [cursor] - Курсор для пагинации (опционально).
 * @property {'stars' | 'forks' | 'updated'} [sortColumn] - Колонка для сортировки (по умолчанию "stars").
 * @property {'asc' | 'desc'} [sortDirection] - Направление сортировки (по умолчанию "desc").
 */
interface SearchData {
  searchTerm: string;
  count: number;
  cursor?: string | null;
  sortColumn?: 'stars' | 'forks' | 'updated';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Асинхронный thunk для получения репозиториев с GitHub GraphQL API.
 * Запрашивает данные о репозиториях в зависимости от переданных параметров.
 *
 * @param {SearchData} param0 Параметры поиска, включая поисковый запрос, cursor (указывает на текущее конкретное место в наборе данных), количество результатов, колонку сортировки и направление сортировки.
 * @param {object} thunkAPI Объект thunk API для обработки ошибок и получения состояния.
 * @return {Promise<{ repositories: Repository[]; pageInfo: PageInfo; totalCount: number }>} Возвращает объект с массивом репозиториев, информацией о странице и общим количеством репозиториев.
 */
export const fetchRepositories = createAsyncThunk<
  { repositories: Repository[]; pageInfo: PageInfo; totalCount: number },
  SearchData,
  { rejectValue: string; state: RootState }
>(
  'repositories/fetchRepositories',
  async (
    { searchTerm, count, cursor, sortColumn = 'stars', sortDirection = 'desc' },
    { rejectWithValue }
  ) => {
    try {
      const query = `${searchTerm} sort:${sortColumn}-${sortDirection}`;

      // поиск репозиториев по имени пользователя
      // const sortQuery = `user:${searchTerm} sort:${sortColumn}-${sortDirection}`;

      const response = await fetch(GITHUB_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query($searchTerm: String!, $count: Int!, $cursor: String) {
              search(query: $searchTerm, type: REPOSITORY, first: $count, after: $cursor) {
                repositoryCount
                edges {
                  node {
                    ... on Repository {
                      id
                      name
                      primaryLanguage {
                        name
                      }
                      forks {
                        totalCount
                      }
                      stargazers {
                        totalCount
                      }
                      updatedAt
                      description
                      licenseInfo {
                        name
                      }
                      languages(first: 10) {
                        nodes {
                          name
                        }
                      }
                    }
                  }
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          `,
          variables: {
            searchTerm: query,
            count,
            cursor: cursor ?? undefined,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GitHubResponse = await response.json();
      return {
        repositories: data.data.search.edges.map(
          (edge: { node: Repository }) => edge.node
        ),
        totalCount: data.data.search.repositoryCount,
        pageInfo: data.data.search.pageInfo,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

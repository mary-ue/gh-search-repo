import { createAsyncThunk } from '@reduxjs/toolkit';
import { PageInfo, Repository } from './searchSlice';
import { RootState } from './store';

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL!;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN!;

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

interface SearchData {
  searchTerm: string;
  count: number;
  cursor?: string | null;
}

export const fetchRepositories = createAsyncThunk<
{ repositories: Repository[]; pageInfo: PageInfo; totalCount: number },
  SearchData,
  { rejectValue: string; state: RootState }
>(
  'repositories/fetchRepositories',
  async ({ searchTerm, count, cursor }, { rejectWithValue }) => {

    try {
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
            searchTerm,
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

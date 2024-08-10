import { createAsyncThunk } from '@reduxjs/toolkit';
import { Repository } from './searchSlice';

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL!;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN!;

interface GitHubResponse {
  data: {
    search: {
      edges: Array<{
        node: Repository;
      }>;
    };
  };
}

export const fetchRepositories = createAsyncThunk<
  Repository[],
  string,
  { rejectValue: string }
>(
  'repositories/fetchRepositories',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await fetch(GITHUB_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              search(query: "${searchTerm}", type: REPOSITORY, first: 10) {
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
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GitHubResponse = await response.json();
      return data.data.search.edges.map(
        (edge: { node: Repository }) => edge.node
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

import { Repository } from '../../store/searchSlice';

export interface ISearchResults {
  repositories: Repository[] | null;
  loading: boolean;
  error: string | null;
  onRepoSelect: (repo: Repository) => void;
  selectedRepo: Repository | null;
}

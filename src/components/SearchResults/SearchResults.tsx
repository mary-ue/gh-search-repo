import { ISearchResults } from './SearchResults.props';
import styles from './SearchResults.module.scss';
import { Pagination } from '../Pagination/Pagination';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/reduxHooks';
import {
  setPage,
  setSortColumn,
  setSortDirection,
} from '../../store/searchSlice';
import { fetchRepositories } from '../../store/searchAction';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export const SearchResults = ({
  repositories,
  loading,
  error,
  onRepoSelect,
  selectedRepo,
}: ISearchResults): JSX.Element => {
  const dispatch = useAppDispatch();
  const { sortColumn, sortDirection, searchData, count, isSorted } =
    useAppSelector((state) => state.search);

  const handleSortChange = (column: 'stars' | 'forks' | 'updated') => {
    dispatch(setPage(1));

    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    dispatch(setSortColumn(column));
    dispatch(setSortDirection(direction));

    dispatch(
      fetchRepositories({
        searchTerm: searchData,
        count: count,
        sortColumn: column,
        sortDirection: direction,
      })
    );
  };

  const getSortIndicator = (column: 'stars' | 'forks' | 'updated') => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? (
        <ArrowUpwardIcon />
      ) : (
        <ArrowDownwardIcon />
      );
    }
    return '';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.results}>
        {repositories && repositories.length > 0 && (
          <>
            <h2 className={styles.title}>Результаты поиска</h2>

            <TableContainer
              component={Paper}
              sx={{ boxShadow: 'none', border: 'none', overflowX: 'hidden' }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap="5px">
                        {!isSorted && <ArrowUpwardIcon />}
                        <span>Название</span>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <span>Язык программирования</span>
                    </TableCell>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleSortChange('forks')}
                    >
                      <Box display="flex" alignItems="center" gap="5px">
                        <span>Число форков</span>
                        {getSortIndicator('forks')}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleSortChange('stars')}
                    >
                      <Box display="flex" alignItems="center" gap="5px">
                        <p>
                          <span>Число звезд</span>
                        </p>
                        <p>{getSortIndicator('stars')}</p>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleSortChange('updated')}
                    >
                      <Box display="flex" alignItems="center" gap="5px">
                        <span>Дата обновления</span>{' '}
                        {getSortIndicator('updated')}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {repositories.map((repo) => (
                    <TableRow
                      key={repo.id}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor:
                          selectedRepo?.id === repo.id ? '#E3F2FD' : 'inherit',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        },
                      }}
                      onClick={() => onRepoSelect(repo)}
                    >
                      <TableCell>
                        {repo.name.length > 20
                          ? `${repo.name.substring(0, 20)}...`
                          : repo.name}
                      </TableCell>
                      <TableCell>
                        {repo.primaryLanguage?.name || 'Не указан'}
                      </TableCell>
                      <TableCell>{repo.forks.totalCount}</TableCell>
                      <TableCell>{repo.stargazers.totalCount}</TableCell>
                      <TableCell>
                        {new Date(repo.updatedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {repositories && repositories.length === 0 && !loading && !error && (
          <p>Репозитории не найдены</p>
        )}
      </div>

      <Pagination />
    </div>
  );
};

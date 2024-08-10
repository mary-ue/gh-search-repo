import { ISearchResults } from './SearchResults.props';
import styles from './SearchResults.module.scss';
import { Pagination } from '../Pagination/Pagination';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export const SearchResults = ({
  repositories,
  loading,
  error,
  onRepoSelect,
}: ISearchResults): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.results}>
        {loading && <p>Загрузка...</p>}

        {error && <p>Ошибка: {error}</p>}

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
                    <TableCell
                      sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.33334 10L4.50834 11.175L9.16668 6.52501V16.6667H10.8333V6.52501L15.4833 11.1833L16.6667 10L10 3.33334L3.33334 10Z"
                          fill="black"
                          fillOpacity="0.56"
                        />
                      </svg>
                      <span>Название</span>
                    </TableCell>
                    <TableCell>Язык программирования</TableCell>
                    <TableCell>Число форков</TableCell>
                    <TableCell>Число звезд</TableCell>
                    <TableCell>Дата обновления</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {repositories.map((repo) => (
                    <TableRow
                      key={repo.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f0f0f0',
                        }
                      }}
                      onClick={() => onRepoSelect(repo)}
                    >
                      <TableCell>{repo.name}</TableCell>
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

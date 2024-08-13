import { useLayoutEffect, useState } from 'react';
import { useAppSelector } from '../../store/reduxHooks';
import { RootState } from '../../store/store';
import { Container } from '../Container/Container';
import { RepoDetails } from '../RepoDetails/RepoDetails';
import { SearchResults } from '../SearchResults/SearchResults';
import styles from './Main.module.scss';
import { Repository } from '../../store/searchSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop } from '@mui/material';

export const Main = (): JSX.Element => {
  const { repositories, loading, error, totalCount } = useAppSelector(
    (state: RootState) => state.search
  );

  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  useLayoutEffect(() => {
    if (repositories || error || totalCount) {
      setSelectedRepo(null);
      setIsFirstSearch(false);
    }
  }, [repositories, error, totalCount]);

  const handleRepoSelect = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <Container className={styles.wrapper}>
          <p className={styles.info}>Ошибка: {error}</p>
        </Container>
      </main>
    );
  }

  if (totalCount === 0 && !isFirstSearch) {
    return (
      <main className={styles.main}>
        <Container className={styles.wrapper}>
          <p className={styles.info}>По вашему запросу ничего не найдено</p>
        </Container>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <Container className={styles.wrapper}>
        {repositories && repositories.length > 0 ? (
          <>
            <SearchResults
              repositories={repositories}
              loading={loading}
              error={error}
              onRepoSelect={handleRepoSelect}
              selectedRepo={selectedRepo}
            />
            <RepoDetails repo={selectedRepo} />
          </>
        ) : (
          <p className={styles.text}>Добро пожаловать</p>
        )}
      </Container>
    </main>
  );
};

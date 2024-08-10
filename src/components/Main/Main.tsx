import { useAppSelector } from '../../store/reduxHooks';
import { RootState } from '../../store/store';
import { Container } from '../Container/Container';
import { RepoDetails } from '../RepoDetails/RepoDetails';
import { SearchResults } from '../SearchResults/SearchResults';
import styles from './Main.module.scss';

export const Main = (): JSX.Element => {
  const { repositories, loading, error } = useAppSelector(
    (state: RootState) => state.search
  );

  return (
    <main className={styles.main}>
      <Container className={styles.wrapper}>
        {repositories === null && error === null && loading === false ? (
          <p className={styles.text}>Добро пожаловать</p>
        ) : (
          <>
            <SearchResults
              repositories={repositories}
              loading={loading}
              error={error}
            />
            <RepoDetails />
          </>
        )}
      </Container>
    </main>
  );
};

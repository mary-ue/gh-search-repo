import { useAppSelector } from '../../store/reduxHooks';
import { RootState } from '../../store/store';
import { Container } from '../Container/Container';
import styles from './Main.module.scss';

export const Main = (): JSX.Element => {
  const { repositories, loading, error } = useAppSelector((state: RootState) => state.search)



  return (
    <main className={styles.main}>
      <Container className={styles.wrapper}>
        {/* <p className={styles.text}>Добро пожаловать</p> */}

        {loading && <p>Загрузка...</p>}

        {error && <p className={styles.error}>Ошибка: {error}</p>}

        {repositories && repositories.length > 0 && (
          <ul className={styles.repoList}>
            {repositories.map((repo) => (
              <li key={repo.name} className={styles.repoItem}>
                <p>{repo.name}</p>
                <p>Язык программирования: {repo.primaryLanguage?.name || 'Не указан'}</p>
                <p>Форков: {repo.forks.totalCount}</p>
                <p>Звёзд: {repo.stargazers.totalCount}</p>
                <p>Обновлено: {new Date(repo.updatedAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}

        {repositories && repositories.length === 0 && !loading && !error && (
          <p className={styles.noResults}>Репозитории не найдены</p>
        )}
      </Container>
    </main>
  );
};
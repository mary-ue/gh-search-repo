import { Container } from '../Container/Container';
import styles from './Main.module.scss';

export const Main = (): JSX.Element => {
  return (
    <main className={styles.main}>
      <Container className={styles.wrapper}>
        <p className={styles.text}>Добро пожаловать</p>
      </Container>
    </main>
  );
};
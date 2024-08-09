import { Container } from '../Container/Container';
import { Search } from '../Search/Search';
import styles from './Header.module.scss';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <Container>
        <Search />
      </Container>
    </header>
  );
};
import { Button, Input } from '@mui/material';
import styles from './Search.module.scss';

export const Search = (): JSX.Element => {

  return (
    <form className={styles.wrapper}>
      <Input
        className={styles.input}
        type="search"
        autoFocus
        placeholder="Введите поисковый запрос"
      />
      <Button
        className={styles.button}
        type="submit"
        variant="contained"
        color="primary"
        size="medium"
      >
        Искать
      </Button>
    </form>
  );
};

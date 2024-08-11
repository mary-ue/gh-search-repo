import { Button, Input } from '@mui/material';
import styles from './Search.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/reduxHooks';
import { fetchRepositories } from '../../store/searchAction';
import { setSearchData } from '../../store/searchSlice';
import { useState } from 'react';

export const Search = (): JSX.Element => {
  const [search, setSearch] = useState<string>('');
  const dispatch = useAppDispatch();
  const { count } = useAppSelector(state => state.search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim()) {
      dispatch(setSearchData(search));
      dispatch(fetchRepositories({ searchTerm: search, count }));
    }
  }

  return (
    <form className={styles.wrapper} onSubmit={handleSearch}>
      <Input
        className={styles.input}
        type="search"
        autoFocus
        placeholder="Введите поисковый запрос"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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

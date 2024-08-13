import { Button, FormHelperText, Input } from '@mui/material';
import styles from './Search.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/reduxHooks';
import { fetchRepositories } from '../../store/searchAction';
import { resetSearchState, setSearchData } from '../../store/searchSlice';
import { useState } from 'react';

export const Search = (): JSX.Element => {
  const [search, setSearch] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { count } = useAppSelector((state) => state.search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim().length >= 2) {
      setError(null);
      dispatch(resetSearchState());
      dispatch(setSearchData(search));
      dispatch(fetchRepositories({ searchTerm: search, count }));
    } else {
      setError('Поисковый запрос должен содержать не менее 2 символов');

      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSearch}>
      <div className={styles.inputWrapper}>
        <Input
          className={styles.input}
          type="search"
          autoFocus
          placeholder="Введите поисковый запрос"
          value={search}
          onChange={(e) => {
            setError(null);
            setSearch(e.target.value);
          }}
        />
        {error && (
          <FormHelperText
            sx={{ position: 'absolute', top: '-5px', left: '20px' }}
            error
          >
            {error}
          </FormHelperText>
        )}
      </div>
      <Button
        sx={{ padding: '10px 20px' }}
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

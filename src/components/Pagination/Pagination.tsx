import { useState } from 'react';
import styles from './Pagination.module.scss';
import { Select, MenuItem, IconButton, SelectChangeEvent } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/reduxHooks';
import { fetchRepositories } from '../../store/searchAction';
import { setSearchCount } from '../../store/searchSlice';

export const Pagination = (): JSX.Element => {
  const {
    count: itemsPerPage,
    searchData: search,
    pageInfo,
    totalCount
  } = useAppSelector((state) => state.search);
  const [page, setPage] = useState<number>(1);
  const dispatch = useAppDispatch();

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(page * itemsPerPage, totalCount);

    const fetchRepos = (newPage: number, count?: number) => {
      dispatch(
        fetchRepositories({
          searchTerm: search,
          count: count || itemsPerPage,
          cursor: newPage === 1 ? undefined : pageInfo?.endCursor,
        })
      );
    };

  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const count = Number(event.target.value);
    dispatch(setSearchCount(count));
    setPage(1);
    fetchRepos(1, count);
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchRepos(newPage);
    }
    if (direction === 'next' && page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchRepos(newPage);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <span>Rows per page: </span>
        <Select value={itemsPerPage} onChange={handleItemsPerPageChange}   sx={{
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  }}>
          {[10, 20, 30, 40, 50].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <span>
          {totalCount > 0 ? `${startIndex} - ${endIndex}` : '0 - 0'} of {totalCount}
        </span>
      </div>
      <div>
        <IconButton
          onClick={() => handlePageChange('prev')}
          disabled={page === 1}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange('next')}
          disabled={!pageInfo?.hasNextPage}
        >
          <ChevronRight />
        </IconButton>
      </div>
    </div>
  );
};

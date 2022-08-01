import { useState, useCallback, useRef } from 'react';
import Spinner from './components/Spinner';
import useBookSearch from './hooks/useBookSearch';

export default function Example2() {
  const [query, setQuery] = useState('');
  const [pageNum, setPageNum] = useState(1);

  const { isLoading, isError, books, hasMore } = useBookSearch(query, pageNum);
  const observer = useRef();

  const lastBookRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => prevPageNum + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNum(1);
  }
  return (
    <div>
      <input type="text" onChange={handleSearch} />
      <div>{isError && 'Error'}</div>

      {books.map((book, i) => {
        if (books.length === i + 1) {
          return (
            <div ref={lastBookRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      {isLoading && <Spinner />}
      {!isLoading && books.length === 0 && <div>No Result</div>}
    </div>
  );
}

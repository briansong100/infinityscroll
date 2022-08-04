import { useState, useCallback, useRef } from 'react';
import Spinner from './components/Spinner';
import useBookSearch from './hooks/useBookSearch';

export default function Example2() {
  const [query, setQuery] = useState('');
  const [pageNum, setPageNum] = useState(1);

  const { isLoading, isError, books, hasMore } = useBookSearch(query, pageNum);

  const observer = useRef();

  const lastBookRef = useCallback(
    // lastBookRef를 세팅한 곳(마지막 div list) 의 노드를 받아서
    (node) => {
      if (isLoading || !node) return;
      // observer가 세팅되어 있어면 해제하고
      if (observer.current) observer.current.disconnect();
      // 현재 observer를 새로 생성하고
      observer.current = new IntersectionObserver((entries) => {
        // 노드가 부착되어 있고 추가 내용이 있으면 pageNum을 증가한다.
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => prevPageNum + 1);
        }
      });
      //새로 생성된 observer에 node를 세팅한다.
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

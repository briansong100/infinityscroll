import { useState, useRef, useCallback } from 'react';
import usePosts from './hooks/usePosts';
import Post from './Post';

function Example() {
  const [pageNum, setPageNum] = useState(1);
  const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum);

  const interceptObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return;
      if (interceptObserver.current) interceptObserver.current.disconnect();

      interceptObserver.current = new IntersectionObserver((intersectionObserverEntry) => {
        if (intersectionObserverEntry[0].isIntersecting && hasNextPage) {
          console.log('Near Last Post');
          setPageNum((prev) => prev + 1);
        }
      });
      if (post) interceptObserver.current.observe(post);
    },
    [isLoading, hasNextPage]
  );

  if (isError) return <p className="center">Error: {error.message}</p>;

  const content = results.map((post, i) => {
    if (results.length === i + 1) {
      return <Post key={post.id} post={post} ref={lastPostRef} />;
    }
    return <Post key={post.id} post={post} />;
  });

  return (
    <>
      <h1 id="top">Infinitie Query Scroll</h1>
      {content}
      {isLoading && <p className="center">Loading More Posts...</p>}
      <p className="center">
        <a href="#top">Back to Top</a>
      </p>
    </>
  );
}

export default Example;

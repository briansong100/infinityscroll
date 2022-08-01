import { useRef, useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';
import { getPostsPage } from './api/axios';

import Post from './Post';

export default function ExampleQuery() {
  const { fetchNextPage, hasNextPage, isFetchingNextPage, data, status, error } = useInfiniteQuery(
    '/posts',
    ({ pageParam = 1 }) => getPostsPage(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    }
  );
  // console.log({ data });
  const interceptObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;
      if (interceptObserver.current) interceptObserver.current.disconnect();

      interceptObserver.current = new IntersectionObserver((intersectionObserverEntry) => {
        if (intersectionObserverEntry[0].isIntersecting && hasNextPage) {
          console.log('Near Last Post');
          fetchNextPage();
        }
      });
      if (post) interceptObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === 'error') return <p className="center">Error: {error.message}</p>;

  const content = data?.pages.map((page) => {
    return page.map((post, i) => {
      if (page.length === i + 1) {
        return <Post key={post.id} post={post} ref={lastPostRef} />;
      }
      return <Post key={post.id} post={post} />;
    });
  });

  return (
    <>
      <h1 id="top">Infinitie Query Scroll - React Query</h1>
      {content}
      {isFetchingNextPage && <p className="center">Loading More Posts...</p>}
      <p className="center">
        <a href="#top">Back to Top</a>
      </p>
    </>
  );
}

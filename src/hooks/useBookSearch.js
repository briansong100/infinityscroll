import axios from 'axios';
import { useEffect, useState } from 'react';

export default function useBookSearch(query, pageNum) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    const controller = new AbortController();
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNum },
      signal: controller.signal,
    })
      .then((res) => {
        setBooks((prevBooks) => [...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)])]);
        // console.log(res.data);
        setHasMore(res.data.docs.length > 0);
        // console.log(res.data.docs.length);
        setIsLoading(false);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        setIsError(true);
      });
    return () => controller.abort();

    // let cancle;
    // axios({
    //   method: 'GET',
    //   url: 'http://openlibrary.org/search.json',
    //   params: { q: query, page: pageNum },
    //   cancelToken: new axios.CancelToken((c) => (cancle = c)),
    // })
    //   .then((res) => {
    //     setBooks((prevBooks) => [...new Set([...prevBooks, ...res.data.docs.map((b) => b.title)])]);
    //     setHasMore(res.data.docs.length > 0);
    //     // console.log({ hasMore });
    //     setIsLoading(false);
    //   })
    //   .catch((e) => {
    //     if (axios.isCancel(e)) return;
    //     setIsError(true);
    //   });

    // return () => cancle();
  }, [query, pageNum]);

  return { isLoading, isError, books, hasMore };
}

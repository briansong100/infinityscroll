import axios from 'axios';

export const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' });

export const getPostsPage = async (pageParam, option = {}) => {
  console.log({ pageParam });
  const resp = await api.get(`posts?_page=${pageParam}`, option);

  console.log(resp);
  return resp.data;
};

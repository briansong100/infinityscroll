import axios from 'axios';

export const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' });

export const getPostsPage = async (pageParam = 1, option = {}) => {
  const resp = await api.get(`/posts?_page=${pageParam}`, option);
  return resp.data;
};

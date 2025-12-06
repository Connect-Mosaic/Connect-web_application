// src/apis/search.js
import { api } from "./client";

export const getSearchResults = async (query) => {
  return await api.get(`/api/search?q=${encodeURIComponent(query)}`);
};
